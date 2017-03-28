// functions related to selecting stuff

pg.selection = function() {
	var selectionMode = "Item";

	
	var getSelectionMode = function() {
		return selectionMode;
	};
	
	
	var checkSelectionMode = function(mode) {
		return selectionMode === mode ? true : false;
	};
	
	
	var setSelectionMode = function(mode) {
		selectionMode = mode;
		if(mode == "Item") {
			var selectedItems = getSelectedItems();
			for(var i=0; i<selectedItems.lengt; i++) {
				selectedItems[i].fullySelected = false;
				selectedItems[i].selected = true;
			}
		}
	};

	
	var selectAll = function() {
		var items = pg.helper.getAllPaperItems();
		
		if(selectionMode === "Segment") {
			for(var i=0; i<items.length; i++) {
				selectItemSegments(items[i], true);
			}
			
		} else if(selectionMode === "Item") {
			for(var i=0; i<items.length; i++) {
				setItemSelection(items[i], true);
			}
		}
	};
	
	
	var selectItemSegments = function(item, state) {
		if(item.children) {
			for(var i=0; i<item.children.length; i++) {
				var child = item.children[i];
				if(child.children && child.children.length > 0) {
					selectItemSegments(child, state);
				} else {
					child.fullySelected = state;
				}
			}
			
		} else {
			item.fullySelected = state;
		}

	};
	
	
	var clearSelection = function() {
		paper.project.deselectAll();
		pg.style.sanitizeSettings();
		
		pg.settingsbar.update();
		pg.style.blurInputs();
		pg.hover.clearHoveredItem();
		pg.settingsbar.hideSection();
		jQuery(document).trigger('SelectionChanged');
	};
	

	var invertSelection = function() {
		var items = pg.helper.getAllPaperItems();

		for(var i=0; i<items.length; i++) {
			items[i].fullySelected = !items[i].fullySelected;
		}
	};


	var deleteSelection = function() {
		if(checkSelectionMode('Item')) {
			var items = getSelectedItems();
			for(var i=0; i<items.length; i++) {
				items[i].remove();
			}

		} else if(checkSelectionMode('Segment')) {
			var items = getSelectedItems();
			for(var i=0; i<items.length; i++) {
				deleteSegments(items[i]);
			}
		}
		
		jQuery(document).trigger('DeleteItems');
		paper.project.view.update();
		pg.undo.snapshot('deleteSelection');
	};
	
	
	var deleteSegments = function(item) {
		if(item.children) {
			for(var i=0; i<item.children.length; i++) {
				var child = item.children[i];
				deleteSegments(child);
			}
		} else {
			var segments = item.segments;
			for(var j=0; j<segments.length; j++) {
				var segment = segments[j];
				if(segment.selected) {
					if(item.closed ||
						(segment.next && 
						!segment.next.selected &&
						segment.previous &&
						!segment.previous.selected) ) {

						splitPathRetainSelection(item, j);
						deleteSelection();
						return;

					} else if(!item.closed) {
						segment.remove();
						j--; // decrease counter if we removed one from the loop
					}

				}
			}
		}
		// remove items with no segments left
		if(item.segments.length <= 0) {
			item.remove();
		}
	};
	

	var splitPathAtSelectedSegments = function() {
		var items = getSelectedItems();
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(checkSelectionMode('Segment')) {
				var segments = item.segments;
				for(var j=0; j<segments.length; j++) {
					var segment = segments[j];
					if(segment.selected) {
						if(item.closed ||
							(segment.next && 
							!segment.next.selected &&
							segment.previous &&
							!segment.previous.selected) ) {
							splitPathRetainSelection(item, j, true);
							splitPathAtSelectedSegments();
							return;
						}
					}
				}
			}
		}
		
	};
	
	
	var splitPathRetainSelection = function(path, index, deselectSplitSegments) {
		var selectedPoints = [];
		
		// collect points of selected segments, so we can reselect them
		// once the path is split.
		for(var i=0; i<path.segments.length; i++) {
			var seg = path.segments[i];
			if(seg.selected) {
				if(deselectSplitSegments && i === index) {
					continue;
				}
				selectedPoints.push(seg.point);
			}
		}
		
		var newPath = path.split(index, 0);
		if(!newPath) return;
		
		// reselect all of the newPaths segments that are in the exact same location
		// as the ones that are stored in selectedPoints
		for(var i=0; i<newPath.segments.length; i++) {
			var seg = newPath.segments[i];
			for(var j=0; j<selectedPoints.length; j++) {
				var point = selectedPoints[j];
				if(point.x === seg.point.x && point.y === seg.point.y) {
					seg.selected = true;
				}
			}
		}
		
		// only do this if path and newPath are different
		// (split at more than one point)
		if(path !== newPath) {
			for(var i=0; i<path.segments.length; i++) {
				var seg = path.segments[i];
				for(var j=0; j<selectedPoints.length; j++) {
					var point = selectedPoints[j];
					if(point.x === seg.point.x && point.y === seg.point.y) {
						seg.selected = true;
					}
				}
			}
		}
	};
	
	
	var cloneSelection = function() {
		var selectedItems = getSelectedItems();
		for(var i = 0; i < selectedItems.length; i++) {
			var item = selectedItems[i];
			item.clone();
			item.selected = false;
		}
		pg.undo.snapshot('cloneSelection');

	};
	
	
	var setItemSelection = function(item, state) {
		var parentGroup = pg.group.getItemsGroup(item);
		var itemsCompoundPath = pg.compoundPath.getItemsCompoundPath(item);
		
		// if selection is in a group, select group not individual items
		if(parentGroup) {
			// do it recursive
			setItemSelection(parentGroup, state);

		} else if(itemsCompoundPath) {
			setItemSelection(itemsCompoundPath, state);

		} else {
			if(item.data && item.data.noSelect) {
				return;
			}
			// fully selected segments need to be unselected first
			item.fullySelected = false; 
			// then the item can be normally selected
			item.selected = state;
			// deselect children of compound-path for cleaner item selection
			if(pg.compoundPath.isCompoundPath(item)) {
				
				var children = item.children;
				if(children) {
					for(var i=0; i<children.length; i++) {
						var child = children[i];
						child.selected = !state;
					}
				}
			}
		}

		pg.settingsbar.update(item);
		pg.style.updateFromSelection();
		pg.style.blurInputs();
		
		jQuery(document).trigger('SelectionChanged');
		
	};


	// this gets all selected non-grouped items and groups
	// (alternative to paper.project.selectedItems, which includes 
	// group children in addition to the group)
	var getSelectedItems = function() {
		var allItems = paper.project.selectedItems;
		var itemsAndGroups = [];

		for(var i=0; i<allItems.length; i++) {
			var item = allItems[i];
			if(pg.group.isGroup(item) &&
				!pg.group.isGroup(item.parent) ||
				!pg.group.isGroup(item.parent)) {
				if(item.data && !item.data.isSelectionBound) {
					itemsAndGroups.push(item);
				}
			}
		}
		return itemsAndGroups;
	};
	
	
	var getSelectionType = function() {
		var selection = getSelectedItems();
		if(selection.length === 0) {
			return 'No selection';
		}
		
		var selectionType = '';
		for(var i=0; i<selection.length; i++) {
			var item = selection[i];
			if(getSelectionMode() === 'Segment') {
				return 'Segment';
			}
			
			if(i === 0) {
				selectionType = item.className;
			}
			if(item.className !== selectionType) {
				return 'Mixed';
			}
		}
		return selectionType;

	};
	
	
	// only returns paths, no compound paths, groups or any other stuff
	var getSelectedPaths = function() {
		var allPaths = getSelectedItems();
		var paths = [];

		for(var i=0; i<allPaths.length; i++) {
			var path = allPaths[i];
			if(path.className === 'Path') {
				paths.push(path);
			}
		}
		return paths;
	};
	
	
	var colorizeSelectedFill = function(colorString) {
		var items = getSelectedItems();
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(pg.item.isPointTextItem(item) && !colorString) {
				colorString = 'rgba(0,0,0,0)';
			}
			item.fillColor = colorString;
		}
		pg.undo.snapshot('colorizeSelectedFill');
	};


	var colorizeSelectedStroke = function(colorString) {
		var items = getSelectedItems();

		for(var i=0; i<items.length; i++) {
			items[i].strokeColor = colorString;
		}
		pg.undo.snapshot('colorizeSelectedStroke');
	};
	
	
	var setOpacity = function(alpha) {
		var items = getSelectedItems();

		for(var i=0; i<items.length; i++) {
			if(pg.group.isGroup(items[i])) {
				continue;
			}
			items[i].opacity = alpha;
		}
		pg.undo.snapshot('setOpacity');
	};
	
	
	var setBlendMode = function(mode) {
		var items = getSelectedItems();
		
		for(var i=0; i<items.length; i++) {
			if(pg.group.isGroup(items[i])) {
				continue;
			}
			items[i].blendMode = mode;
		}
		pg.undo.snapshot('setBlendMode');
	};
	
	
	var setStrokeWidth = function(value) {
		var items = getSelectedItems();

		for(var i=0; i<items.length; i++) {
			if(pg.group.isGroup(items[i])) {
				continue;
			}
			items[i].strokeWidth = value;
		}
		pg.undo.snapshot('setStrokeWidth');
	};
	
	
	var setFontFamily = function(value) {
		var items = getSelectedItems();
		
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(pg.item.isPointTextItem(item)) {
				item.fontFamily = value;
			}
		}
		pg.undo.snapshot('setFontFamily');
	};
	
	
	var setFontWeight = function(value) {
		var items = getSelectedItems();
		
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(pg.item.isPointTextItem(item)) {
				item.fontWeight = value;
			}
		}
		pg.undo.snapshot('setFontWeight');
	};
	
	
	var setFontSize = function(value) {
		var items = getSelectedItems();
		
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(pg.item.isPointTextItem(item)) {
				item.fontSize = value;
				item.leading = item.fontSize;
			}
		}
		pg.undo.snapshot('setFontSize');
	};
	
	
	var switchSelectedHandles = function(mode) {
		var items = getSelectedItems();
		for(var i=0; i<items.length; i++) {
			var segments = items[i].segments;
			for(var j=0; j<segments.length; j++) {
				var seg = segments[j];
				if(!seg.selected) continue;

				pg.geometry.switchHandle(seg, mode);
			}
		}
		pg.undo.snapshot('switchSelectedHandles');
	};
	
	
	var removeSelectedSegments = function() {
		pg.undo.snapshot('removeSelectedSegments');
		
		var items = getSelectedItems();
		var segmentsToRemove = [];
		
		for(var i=0; i<items.length; i++) {
			var segments = items[i].segments;
			for(var j=0; j < segments.length; j++) {
				var seg = segments[j];
				if(seg.selected) {
					segmentsToRemove.push(seg);
				}
			}
		}
		
		for(var i=0; i<segmentsToRemove.length; i++) {
			var seg = segmentsToRemove[i];
			seg.remove();
		}
	};
	
	
	var processRectangularSelection = function(event, rect, mode) {
		var allItems = pg.helper.getAllPaperItems();
		
		itemLoop:
		for(var i=0; i<allItems.length; i++) {
			var item = allItems[i];
			// check for item segment points inside selectionRect
			
			if(pg.group.isGroup(item) || pg.item.isCompoundPathItem(item)) {
				if(!rectangularSelectionGroupLoop(item, rect, item, event, mode)) {
					continue itemLoop;
				}
				
			} else {
				if(!handleRectangularSelectionItems(item, event, rect, mode)) {
					continue itemLoop;
				}
			}
		}
	};
	
	
	// if the rectangular selection found a group, drill into it recursively
	var rectangularSelectionGroupLoop = function(group, rect, root, event, mode) {
		for(var i=0; i<group.children.length; i++) {
			var child = group.children[i];
			
			if(pg.group.isGroup(child)) {
				rectangularSelectionGroupLoop(child, rect, root, event, mode);
				
			} else {
				if(!handleRectangularSelectionItems(child, event, rect, mode)) {
					return false;
				}
			}
		}
		return true;
	};
	
	
	var handleRectangularSelectionItems = function(item, event, rect, mode) {
		if(pg.item.isPathItem(item)) {
			var segmentMode = false;
			
			// first round checks for segments inside the selectionRect
			for(var j=0; j<item.segments.length; j++) {
				var seg = item.segments[j];
				if( rect.contains(seg.point)) {
					if(mode === 'detail') {
						if(event.modifiers.shift && seg.selected) {
							seg.selected = false;
						} else {
							seg.selected = true;
						}
						segmentMode = true;

					} else {
						if(event.modifiers.shift && item.selected) {
							setItemSelection(item,false);

						} else {
							setItemSelection(item,true);
						}
						return false;
					}
				}
			}

			// second round checks for path intersections
			var intersections = item.getIntersections(rect);
			if( intersections.length > 0 && !segmentMode) {
				// if in detail select mode, select the curves that intersect
				// with the selectionRect
				if(mode === 'detail') {
					for(var k=0; k<intersections.length; k++) {
						var curve = intersections[k].curve;
						// intersections contains every curve twice because
						// the selectionRect intersects a circle always at
						// two points. so we skip every other curve
						if(k % 2 === 1) {
							continue;
						}

						if(event.modifiers.shift) {
							curve.selected = !curve.selected;
						} else {
							curve.selected = true;
						}
					}

				} else {
					if(event.modifiers.shift && item.selected) {
						setItemSelection(item,false);

					} else {
						setItemSelection(item,true);
					}
					return false;
				}
			}
			pg.settingsbar.update(item);

		} else if(pg.item.isBoundsItem(item)) {
			if(checkBoundsItem(rect, item, event)) {
				return false;
			}
		}
		return true;
	};	
	
	
	var checkBoundsItem = function(selectionRect, item, event) {
		var itemBounds = new paper.Path([
			item.localToGlobal(item.internalBounds.topLeft),
			item.localToGlobal(item.internalBounds.topRight),
			item.localToGlobal(item.internalBounds.bottomRight),
			item.localToGlobal(item.internalBounds.bottomLeft)
		]);
		itemBounds.closed = true;
		itemBounds.guide = true;

		for(var i=0; i<itemBounds.segments.length; i++) {
			var seg = itemBounds.segments[i];
			if( selectionRect.contains(seg.point) ||
				(i === 0 && selectionRect.getIntersections(itemBounds).length > 0)) {
				if(event.modifiers.shift && item.selected) {
					setItemSelection(item,false);

				} else {
					setItemSelection(item,true);
				}
				itemBounds.remove();
				return true;
				
			}
		}

		itemBounds.remove();
	};
	
	
	return {
		getSelectionMode: getSelectionMode,
		checkSelectionMode: checkSelectionMode,
		setSelectionMode: setSelectionMode,
		selectAll: selectAll,
		clearSelection: clearSelection,
		invertSelection: invertSelection,
		deleteSelection: deleteSelection,
		splitPathAtSelectedSegments: splitPathAtSelectedSegments,
		cloneSelection: cloneSelection,
		setItemSelection: setItemSelection,
		getSelectedItems: getSelectedItems,
		getSelectionType: getSelectionType,
		getSelectedPaths: getSelectedPaths,
		colorizeSelectedFill: colorizeSelectedFill,
		colorizeSelectedStroke: colorizeSelectedStroke,
		setOpacity: setOpacity,
		setBlendMode: setBlendMode,
		setStrokeWidth: setStrokeWidth,
		setFontFamily: setFontFamily,
		setFontWeight: setFontWeight,
		setFontSize: setFontSize,
		switchSelectedHandles: switchSelectedHandles,
		removeSelectedSegments: removeSelectedSegments,
		processRectangularSelection: processRectangularSelection
	};
	
}();
