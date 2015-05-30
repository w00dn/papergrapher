// select tool
// adapted from resources on http://paperjs.org and 
// https://github.com/memononen/stylii

pg.tools.select = function() {
	var tool;
	
	var options = {
		name: 'Select',
		type: 'toolbar'
	};

	var activateTool = function() {
		pg.selection.setSelectionMode('Item');
		tool = new Tool();
	
		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 5
		};

		var doRectSelection = false;
		var selectionRect;
		
		var doCloneMove = false;
		var selectionDragged = false;
		var lastEvent = null;

		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
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
			
			pg.hover.clearHoveredItem();
			var hitResult = project.hitTest(event.point, hitOptions);
			if (hitResult) {
				// deselect all by default if the shift key isn't pressed
				if(!event.modifiers.shift && !hitResult.item.selected) {
					pg.selection.clearSelection();
				}
				// deselect a currently selected item if shift is pressed
				if(event.modifiers.shift && hitResult.item.selected) {
					pg.selection.setItemSelection(hitResult.item, false);
					
				} else {
					if(doubleClicked && pg.item.isPointTextItem(hitResult.item)) {
						pg.toolbar.switchTool(pg.tools.newToolByName('Text'));
						pg.toolbar.getActiveTool().quickEditItem(hitResult.item);
					}
					
					pg.selection.setItemSelection(hitResult.item, true);
					
					if(doCloneMove) pg.selection.cloneSelection();
				}

			} else {
				if (!event.modifiers.shift) {
					pg.selection.clearSelection();
				}
				doRectSelection = true;
			}

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
				selectionDragged = true;
				doRectSelection = false;
				
				var dragVector = (event.point - event.downPoint);
				var selectedItems = pg.selection.getSelectedItems();

				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					
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
				}
			}
		};

		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			
			if(doRectSelection && selectionRect) {
				pg.selection.processRectangularSelection(event, selectionRect);
				selectionRect.remove();
				
			} else {
				if(selectionDragged) {
					pg.undo.snapshot('moveSelection');
					selectionDragged = false;
				}
				
				// resetting the items origin point for the next usage
				var selectedItems = pg.selection.getSelectedItems();

				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					// remove the orig pos again
					item.origPos = null;					
				}
			}
			
			doRectSelection = false;
			selectionRect = null;

		};
		
		tool.onKeyDown = function(event) {
			switch(event.key) {
				case 'option':
					doCloneMove = true;
					break;
			}
		};
		
		tool.onKeyUp = function(event) {
			switch(event.key) {
				case 'option':
					doCloneMove = false;
					break;
			}
		};
		
		tool.activate();
	};


	var deactivateTool = function() {
		pg.selection.setSelectionMode('None');
		pg.hover.clearHoveredItem();
	};

	
	return {
		options: options,
		activateTool: activateTool,
		deactivateTool: deactivateTool
	};
	
};
