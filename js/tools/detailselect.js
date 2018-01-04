// select tool
// adapted from resources on http://paperjs.org and 
// https://github.com/memononen/stylii

pg.tools.registerTool({
	id: 'detailselect',
	name: 'Detail select',
	usedKeys : {
		toolbar : 'a'
	}
});

pg.tools.detailselect = function() {
	var tool;
	var keyModifiers = {};
	
	var options = {};
	
	var menuEntries = {
		selectionTitle: {
			type : 'title',
			text :'Selection'
		},
		selectAll: {
			type: 'button',
			label: 'Select all',
			click: 'pg.selection.selectAllSegments'
		},
		selectNone: {
			type: 'button',
			label: 'Deselect all',
			click: 'pg.selection.clearSelection'
		},
		invertSelection: {
			type: 'button',
			label: 'Invert selection',
			click: 'pg.selection.invertSegmentSelection'
		},
		segmentTitle: {
			type : 'title',
			text :'Segment'
		},
		switchHandles: {
			type: 'button',
			label: 'Switch handles',
			click: 'pg.selection.switchSelectedHandles'
		},
		removeSegments: {
			type: 'button',
			label: 'Remove segments',
			click: 'pg.selection.removeSelectedSegments'
		},
		splitPath: {
			type: 'button',
			label: 'Split path',
			click: 'pg.selection.splitPathAtSelectedSegments'
		}
		
	};

	var activateTool = function() {		
		tool = new Tool();
				
		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			handles: true,
			fill: true,
			guide: false,
			tolerance: 3 / paper.view.zoom
		};
		
		var doRectSelection = false;
		var selectionRect;
		
		var hitType;
		
		var lastEvent = null;
		var selectionDragged = false;
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			
			selectionDragged = false;
			
			var doubleClicked = false;
			
			if(lastEvent) {
				if((event.event.timeStamp - lastEvent.event.timeStamp) < 250) {
					doubleClicked = true;
					if (!event.modifiers.shift) {
						pg.selection.clearSelection();
					}
				} else {
					doubleClicked = false;
				}
			}
			lastEvent = event;
			
			hitType = null;
			pg.hover.clearHoveredItem();
			var hitResult = paper.project.hitTest(event.point, hitOptions);
			if (!hitResult) {
				if (!event.modifiers.shift) {
					pg.selection.clearSelection();
				}
				doRectSelection = true;
				return;
			}
			
			// dont allow detail-selection of PGTextItem
			if(hitResult && pg.item.isPGTextItem(pg.item.getRootItem(hitResult.item))) {
				return;
			}
				
			if(hitResult.type === 'fill' || doubleClicked) {

				hitType = 'fill';
				if(hitResult.item.selected) {
					if(event.modifiers.shift) {
						hitResult.item.fullySelected = false;
					}
					if(doubleClicked) {
						hitResult.item.selected = false;
						hitResult.item.fullySelected = true;
					}
					if(event.modifiers.option) pg.selection.cloneSelection();

				} else {
					if(event.modifiers.shift) {
						hitResult.item.fullySelected = true;
					} else {
						paper.project.deselectAll();
						hitResult.item.fullySelected = true;


						if(event.modifiers.option) pg.selection.cloneSelection();
					}
				}

			} else if(hitResult.type === 'segment') {
				hitType = 'point';

				if(hitResult.segment.selected) {
					// selected points with no handles get handles if selected again
					hitResult.segment.selected = true;
					if(event.modifiers.shift) {
						hitResult.segment.selected = false;
					}

				} else {
					if(event.modifiers.shift) {
						hitResult.segment.selected = true;
					} else {
						paper.project.deselectAll();
						hitResult.segment.selected = true;
					}
				}
				
				if(event.modifiers.option) pg.selection.cloneSelection();


			} else if(
				hitResult.type === 'stroke' || 
				hitResult.type === 'curve') {
				hitType = 'curve';

				var curve = hitResult.location.curve;
				if(event.modifiers.shift) {
					curve.selected = !curve.selected;

				} else if(!curve.selected) {
					paper.project.deselectAll();
					curve.selected = true;
				}

				if(event.modifiers.option) pg.selection.cloneSelection();

			} else if(
				hitResult.type === 'handle-in' || 
				hitResult.type === 'handle-out') {
				hitType = hitResult.type;

				if(!event.modifiers.shift) {
					paper.project.deselectAll();
				}
				
				hitResult.segment.handleIn.selected = true;
				hitResult.segment.handleOut.selected = true;
			}
			
			pg.statusbar.update();
		};
		
		tool.onMouseMove = function(event) {
			pg.hover.handleHoveredItem(hitOptions, event);
		};
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			
			if(doRectSelection) {
				selectionRect = pg.guides.rectSelect(event);
				// Remove this rect on the next drag and up event
				selectionRect.removeOnDrag();

			} else {
				doRectSelection = false;
				selectionDragged = true;
				
				var selectedItems = pg.selection.getSelectedItems();
				var dragVector = (event.point - event.downPoint);
				
				for(var i=0; i < selectedItems.length; i++) {
					var item = selectedItems[i];

					if(hitType === 'fill' || !item.segments) {
						
						// if the item has a compound path as a parent, don't move its
						// own item, as it would lead to double movement
						if(item.parent && pg.compoundPath.isCompoundPath(item.parent)) {
							continue;
						}
						
						// add the position of the item before the drag started
						// for later use in the snap calculation
						if(!item.origPos) {
							item.origPos = item.position;
						}

						if (event.modifiers.shift) {
							item.position = item.origPos + 
							pg.math.snapDeltaToAngle(dragVector, Math.PI*2/8);

						} else {
							item.position += event.delta;
						}

					} else {
						for(var j=0; j < item.segments.length; j++) {
							var seg = item.segments[j];
							// add the point of the segment before the drag started
							// for later use in the snap calculation
							if(!seg.origPoint) {
								seg.origPoint = seg.point.clone();
							}

							if( seg.selected && (
								hitType === 'point' || 
								hitType === 'stroke' || 
								hitType === 'curve')){

								if (event.modifiers.shift) {
									seg.point = seg.origPoint + 
									pg.math.snapDeltaToAngle(dragVector, Math.PI*2/8);

								} else {
									seg.point += event.delta;
								}

							} else if(seg.handleOut.selected && 
								hitType === 'handle-out'){
								//if option is pressed or handles have been split, 
								//they're no longer parallel and move independently
								if( event.modifiers.option ||
									!seg.handleOut.isColinear(seg.handleIn)) {
									seg.handleOut += event.delta;

								} else {
									seg.handleIn -= event.delta;
									seg.handleOut += event.delta;
								}

							} else if(seg.handleIn.selected && 
								hitType === 'handle-in') {

								//if option is pressed or handles have been split, 
								//they're no longer parallel and move independently
								if( event.modifiers.option ||
									!seg.handleOut.isColinear(seg.handleIn)) {
									seg.handleIn += event.delta;

								} else {
									seg.handleIn += event.delta;
									seg.handleOut -= event.delta;
								}	
							}
						}
						
					}
				}
			}
		};

		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return; // only first mouse button
		
			if(doRectSelection && selectionRect) {
				pg.selection.processRectangularSelection(event, selectionRect, 'detail');
				selectionRect.remove();
				
			} else {
				
				if(selectionDragged) {
					pg.undo.snapshot('moveSelection');
					selectionDragged = false;
				}
				
				// resetting the items and segments origin points for the next usage
				var selectedItems = pg.selection.getSelectedItems();

				for(var i=0; i < selectedItems.length; i++) {
					var item = selectedItems[i];
					// for the item
					item.origPos = null;
					// and for all segments of the item
					if(item.segments) {
						for(var j=0; j < item.segments.length; j++) {
							var seg = item.segments[j];
								seg.origPoint = null;
						}
					}
				}
			}
			
			doRectSelection = false;
			selectionRect = null;

		};
		
		tool.onKeyDown = function(event) {
			keyModifiers[event.key] = true;
		};
		
		tool.onKeyUp = function(event) {
			if(keyModifiers.control) {
				if(event.key === 'a') {
					pg.selection.selectAllSegments();
				} else if(event.key === 'i') {
					pg.selection.invertSegmentSelection();
				}
			}
			keyModifiers[event.key] = false;
		};
		
		// setup floating tool options panel in the editor
		//pg.toolOptionPanel.setup(options, components, function(){ });
		
		pg.menu.setupToolEntries(menuEntries);
		
		tool.activate();
	};

	
	var deactivateTool = function() {
		pg.hover.clearHoveredItem();
		pg.menu.clearToolEntries();
	};


	return {
		options: options,
		activateTool: activateTool,
		deactivateTool: deactivateTool
	};
	
};