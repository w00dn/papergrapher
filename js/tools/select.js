// select tool
// adapted from resources on http://paperjs.org and 
// https://github.com/memononen/stylii

pg.tools.select = function() {
	var tool;
	
	var boundsPath;
	var boundsScaleHandles = [];
	var boundsRotHandles = [];	
 
	var options = {
		name: 'Select'
	};

	var activateTool = function() {
		pg.selection.setSelectionMode('Item');
		setSelectionBounds();
		preProcessSelection();
		tool = new Tool();

		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 4 / paper.view.zoom
		};

		var mode = 'none';

		var selectionRect;

		var itemGroup;
		var pivot;
		var corner;
		var origPivot;
		var origSize;
		var origCenter;
		var scaleItems;
		
		var rotItems = [];
		var rotGroupPivot;
		var prevRot = [];

		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			pg.hover.clearHoveredItem();
			
			var hitResult = paper.project.hitTest(event.point, hitOptions);
			if (hitResult) {
				
				if(hitResult.item.data && hitResult.item.data.isScaleHandle) {
					mode = 'scale';
					var index = hitResult.item.data.index;					
					pivot = boundsPath.bounds[getOpposingRectCornerNameByIndex(index)].clone();
					origPivot = boundsPath.bounds[getOpposingRectCornerNameByIndex(index)].clone();
					corner = boundsPath.bounds[getRectCornerNameByIndex(index)].clone();
					origSize = corner.subtract(pivot);
					origCenter = boundsPath.bounds.center;
					scaleItems = pg.selection.getSelectedItems();
					
				} else if(hitResult.item.data && hitResult.item.data.isRotHandle) {
					mode = 'rotate';
					rotGroupPivot = boundsPath.bounds.center;
					rotItems = pg.selection.getSelectedItems();
					
					jQuery.each(rotItems, function(i, item) {
						prevRot[i] = (event.point - rotGroupPivot).angle;
					});
										
				} else {

					// deselect all by default if the shift key isn't pressed
					if(!event.modifiers.shift && !hitResult.item.selected) {
						pg.selection.clearSelection();
					}
					// deselect a currently selected item if shift is pressed
					if(event.modifiers.shift && hitResult.item.selected) {
						pg.selection.setItemSelection(hitResult.item, false);

					} else {
						pg.selection.setItemSelection(hitResult.item, true);

						if(event.modifiers.alt) {
							mode = 'cloneMove';
							pg.selection.cloneSelection();

						} else {
							mode = 'move';
						}
					}
				}
				// while transforming object, never show the bounds stuff
				removeBoundsPath();

			} else {
				if (!event.modifiers.shift) {
					removeBoundsPath();
					pg.selection.clearSelection();
				}
				mode = 'rectSelection';
			}

		};

		tool.onMouseMove = function(event) {			
			pg.hover.handleHoveredItem(hitOptions, event);
		};

		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			
			var modOrigSize = origSize;
			
			if(mode == 'rectSelection') {
				selectionRect = pg.guides.rectSelect(event);
				// Remove this rect on the next drag and up event
				selectionRect.removeOnDrag();

			} else if(mode == 'scale') {
				itemGroup = new paper.Group(scaleItems);
				itemGroup.addChild(boundsPath);
				itemGroup.data.isHelperItem = true;
				itemGroup.strokeScaling = false;
				itemGroup.applyMatrix = false;

				if (event.modifiers.alt) {
					pivot = origCenter;
					modOrigSize = origSize*0.5;
				} else {
					pivot = origPivot; 
				}

				corner = corner.add(event.delta);
				var size = corner.subtract(pivot);
				var sx = 1.0, sy = 1.0;
				if (Math.abs(modOrigSize.x) > 0.0000001) {
					sx = size.x / modOrigSize.x;
				}
				if (Math.abs(modOrigSize.y) > 0.0000001) {
					sy = size.y / modOrigSize.y;
				}

				if (event.modifiers.shift) {
					var signx = sx > 0 ? 1 : -1;
					var signy = sy > 0 ? 1 : -1;
					sx = sy = Math.max(Math.abs(sx), Math.abs(sy));
					sx *= signx;
					sy *= signy;
				}

				itemGroup.scale(sx, sy, pivot);
				
				jQuery.each(boundsScaleHandles, function(index, handle) {
					handle.position = itemGroup.bounds[getRectCornerNameByIndex(index)];
					handle.bringToFront();
				});
				
				jQuery.each(boundsRotHandles, function(index, handle) {
					if(handle) {
						handle.position = itemGroup.bounds[getRectCornerNameByIndex(index)]+handle.data.offset;
						handle.bringToFront();
					}
				});
				
			} else if(mode == 'rotate') {
				var rotAngle = (event.point - rotGroupPivot).angle;
				
				jQuery.each(rotItems, function(i, item) {
					
					if(!item.data.origRot) {
						item.data.origRot = item.rotation;
					}
					
					if(event.modifiers.shift) {
						rotAngle = Math.round(rotAngle / 45) *45;
						item.applyMatrix = false;
						item.pivot = rotGroupPivot;
						item.rotation = rotAngle;
						
					} else {
						item.rotate(rotAngle - prevRot[i], rotGroupPivot);
					}
					prevRot[i] = rotAngle;
				});
				
			} else if(mode == 'move' || mode == 'cloneMove') {
				
				var dragVector = (event.point - event.downPoint);
				var selectedItems = pg.selection.getSelectedItems();

				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					
					// add the position of the item before the drag started
					// for later use in the snap calculation
					if(!item.data.origPos) {
						item.data.origPos = item.position;
					}

					if (event.modifiers.shift) {
						item.position = item.data.origPos + 
						pg.math.snapDeltaToAngle(dragVector, Math.PI*2/8);

					} else {
						item.position += event.delta;
					}
				}
			}
		};

		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			
			if(mode == 'rectSelection' && selectionRect) {
				pg.selection.processRectangularSelection(event, selectionRect);
				selectionRect.remove();
				
			} else if(mode == 'move' || mode == 'cloneMove') {
				pg.undo.snapshot('moveSelection');
				
				// resetting the items origin point for the next usage
				var selectedItems = pg.selection.getSelectedItems();

				jQuery.each(selectedItems, function(index, item) {
					// remove the orig pos again
					item.data.origPos = null;			
				});
				
			} else if(mode == 'scale') {
				itemGroup.applyMatrix = true;
				itemGroup.layer.addChildren(itemGroup.children);
				itemGroup.remove();
				pg.undo.snapshot('scaleSelection');
				
			} else if(mode == 'rotate') {
				
				pg.undo.snapshot('rotateSelection');
			}
			
			mode = 'none';
			selectionRect = null;
			
			if(pg.selection.getSelectedItems().length <= 0) {
				removeBoundsPath();
			} else {
				setSelectionBounds();
			}
		};
		
		jQuery(document).on('DeleteItems Undo Grouped Ungrouped SelectionChanged', function(){
			setSelectionBounds();
		});
				
		tool.activate();
	};


	var deactivateTool = function() {
		jQuery(document).off('DeleteItems Undo Grouped Ungrouped');
		pg.selection.setSelectionMode('None');
		pg.hover.clearHoveredItem();
		removeBoundsPath();
	};
	
	
	var setSelectionBounds = function() {
		removeBoundsPath();
		
		var items = pg.selection.getSelectedItems();
		if(items.length <= 0) return;
		
		var rect;
		jQuery.each(items, function(index, item) {
			if(rect) {
				rect = rect.unite(item.bounds);
			} else {
				rect = item.bounds;
			}
		});
		
		if(!boundsPath) {
			boundsPath = new paper.Path.Rectangle(rect);
			boundsPath.curves[0].divideAtTime(0.5);
			boundsPath.curves[2].divideAtTime(0.5);
			boundsPath.curves[4].divideAtTime(0.5);
			boundsPath.curves[6].divideAtTime(0.5);
		}
		boundsPath.guide = true;
		boundsPath.data.isSelectionBound = true;
		boundsPath.data.isHelperItem = true;
		boundsPath.fillColor = null;
		boundsPath.strokeScaling = false;
		boundsPath.fullySelected = true;
		boundsPath.parent = pg.layer.getGuideLayer();
		
		jQuery.each(boundsPath.segments, function(index, segment) {
			var size = 4;
			
			if(index%2 == 0) {
				size = 6;
			}
			
			if(index == 7) {
				var offset = new Point(0, 10/paper.view.zoom);
				boundsRotHandles[index] =
				new paper.Path.Circle({
					center: segment.point + offset,
					data: {
						offset: offset,
						isRotHandle: true,
						isHelperItem: true,
						noSelect: true,
						noHover: true
					},
					radius: 5 / paper.view.zoom,
					strokeColor: pg.guides.getGuideColor('blue'),
					fillColor: 'white',
					strokeWidth: 0.5 / paper.view.zoom,
					parent: pg.layer.getGuideLayer()
				});
			}
			
			boundsScaleHandles[index] =
				new paper.Path.Rectangle({
					center: segment.point,
					data: {
						index:index,
						isScaleHandle: true,
						isHelperItem: true,
						noSelect: true,
						noHover: true
					},
					size: [size/paper.view.zoom,size/paper.view.zoom],
					fillColor: pg.guides.getGuideColor('blue'),
					parent: pg.layer.getGuideLayer()
				});
		});
	};
	
	
	var removeBoundsPath = function() {
		pg.guides.removeHelperItems();
		boundsPath = null;
		boundsScaleHandles.length = 0;
		boundsRotHandles.length = 0;
	};
	
	
	var preProcessSelection = function() {
		
		// when switching to the select tool while having a child object of a
		// compound path selected, deselect the child and select the compound path
		// instead. (otherwise the compound path breaks because of scale-grouping)
		var items = pg.selection.getSelectedItems();
		jQuery.each(items, function(index, item) {
			if(pg.compoundPath.isCompoundPathChild(item)) {
				var cp = pg.compoundPath.getItemsCompoundPath(item);
				pg.selection.setItemSelection(item, false);
				pg.selection.setItemSelection(cp, true);
			}
		});
		setSelectionBounds();
	};
	
	
	var getRectCornerNameByIndex = function(index) {
		switch(index) {
			case 0:
				return 'bottomLeft';
			
			case 1:
				return 'leftCenter';
				
			case 2:
				return 'topLeft';
			
			case 3:
				return 'topCenter';
			
			case 4:
				return 'topRight';
			
			case 5:
				return 'rightCenter';
			
			case 6:
				return 'bottomRight';
				
			case 7:
				return 'bottomCenter';
		}
	};
	
	var getOpposingRectCornerNameByIndex = function(index) {
		switch(index) {
			case 0:
				return 'topRight';
				
			case 1:
			 return 'rightCenter';
				
			case 2:
				return 'bottomRight';
				
			case 3:
				return 'bottomCenter';
			
			case 4:
				return 'bottomLeft';
				
			case 5:
				return 'leftCenter';
			
			case 6:
				return 'topLeft';
				
			case 7:
				return 'topCenter';
		}
	};

	
	
	return {
		options: options,
		activateTool: activateTool,
		deactivateTool: deactivateTool
	};
	
};
