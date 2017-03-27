
pg.tools.rotate = function() {
	var tool;
	
	var options = {
		name: 'Rotate',
		rotationCenter: 'selection',
		randomSpeed: false,
		lookAt: false
	};
	
	var components = {
		rotationCenter: {
			type: 'list',
			label: 'Center',
			options: [ 'individual', 'selection', 'cursor' ]
		},
		randomSpeed: {
			type: 'boolean',
			label: 'Random speed',
			requirements: {rotationCenter: 'individual'}
		},
		lookAt: {
			type: 'boolean',
			label: 'Lookat',
			requirements: {rotationCenter: 'individual'}
		}
	};
	
	var activateTool = function() {
		
		var selectedItems;
		var fixedGroupPivot;
		var pivotMarker = [];
		var rotGuideMarker;
		var rotGuideLine;
		var rand = [];
		var initAngles = [];
		var transformed = false;
		var prevRot = [];
		var mouseDown;
		
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		
		tool = new Tool();
		
		// on click, we first need the angle difference between where the user
		// clicked relative to the items/groups initial angle
		tool.onMouseDown = function(event) {
			transformed = false;
			selectedItems = pg.selection.getSelectedItems();
			mouseDown = event.point;
			
			if(selectedItems.length === 0) return;
			
			if(options.rotationCenter === 'individual') {
				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					item.applyMatrix = false;
					pivotMarker.push(pg.guides.crossPivot(item.position));
					if(options.randomSpeed) {
						rand.push((Size.random().width));
					}
					initAngles[i] = item.rotation;
				}
				
				// paint rotation guide line
				rotGuideLine = pg.guides.line(event.downPoint, event.point);
				rotGuideMarker = pg.guides.rotPivot(event.downPoint, 'grey');
				
			} else {
				
				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					item.applyMatrix = true;
				}
				
				// only set the fixedPivot once per tool activation/mode switch
				// or the center point moves based on the selection bounds
				if(!fixedGroupPivot) {
					var bounds = null;
					for(var i=0; i<selectedItems.length; i++) {
						var item = selectedItems[i];
						if(i === 0) {
							bounds = item.bounds;
						} else {
							bounds = bounds.unite(item.bounds);
						}
					}
					fixedGroupPivot = bounds.center;
				}
				
				if(options.rotationCenter === 'cursor') {
					fixedGroupPivot = event.point.clone();
				}
				
				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					pg.item.setPivot(item, fixedGroupPivot.clone());
					prevRot[i] = (event.point - fixedGroupPivot).angle;
				}

				// paint pivot guide
				pivotMarker[0] = pg.guides.rotPivot(fixedGroupPivot, 'grey');
				
				// paint rotation guide line
				rotGuideLine = pg.guides.line(fixedGroupPivot, event.point);
			}
		};
		
		tool.onMouseDrag = function(event) {
			if(selectedItems.length === 0) return;
			
			if(options.rotationCenter === 'individual') {

				var rotAngle = (event.point - event.downPoint).angle;
				
				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					item.applyMatrix = false;
					
					
					if((event.point - event.downPoint).length < 20) {
						// the initial drag angle is determined by the first 20 units
						// of drag (used for initial rotation fix)
						initAngles[i] = (event.point - event.downPoint).angle - item.rotation;
					}
					// shift snaps the rotation in 45 degree steps
					if(event.modifiers.shift) {
						rotAngle = Math.round(rotAngle / 45) *45;
						item.rotation = rotAngle;
						
					} else if(options.lookAt) {
						item.applyMatrix = false;
						var ang = (event.point - item.position).angle;
						item.rotation = ang;
						
					} else {
						// rotations with random speed use item.rotate instead of
						// item.rotation for smoother handling and better vis. feedback
						if(options.randomSpeed) {
							var currentAngle = (event.point - event.downPoint).angle;
							var lastAngle = (event.lastPoint - event.downPoint).angle;
							var angleDiff = currentAngle - lastAngle;
							
							// nullify the rotation until the user dragged 20 units
							// prevents irratic behaviour since event.point and
							// event.downPoint start in the same location 
							if((event.point - event.downPoint).length < 20) {
								angleDiff = 0;
							}
							
							var randomSpeed = angleDiff < 0 ? -rand[i] : rand[i];
							item.rotate(angleDiff + randomSpeed, item.position);
							
						} else {
							item.rotation = rotAngle - initAngles[i];
						}
					}
				}
								
			} else {
				var rotAngle = (event.point - fixedGroupPivot).angle;
				
				for(var i=0; i<selectedItems.length; i++) {
					var item = selectedItems[i];
					// shift snaps the rotation in 45 degree steps
					
					if(event.modifiers.shift) {
						rotAngle = Math.round(rotAngle / 45) *45;
						item.applyMatrix = false;
						item.rotation = rotAngle;
						
					} else {
						item.rotate(rotAngle - prevRot[i]);

					}
					prevRot[i] = rotAngle;
				}
			}
			transformed = true;
			rotGuideLine.lastSegment.point = event.point;

		};
		
		tool.onMouseUp = function(event) {
			if(selectedItems.length === 0) return;
			
			// cleaning up!
			
			for(var i=0; i<pivotMarker.length; i++) {
				pivotMarker[i].remove();
			}
			if(rotGuideLine) {
				rotGuideLine.remove();
			}
			if(rotGuideMarker) {
				rotGuideMarker.remove();
			}
			
			// resetting pivots to item centers
			for(var i=0; i<selectedItems.length; i++) {
				var item = selectedItems[i];
				
				pg.item.setPivot(item, item.bounds.center);

			}
			
			initAngles = [];
			if(transformed) {
				pg.undo.snapshot('rotate');
				transformed = false;
			}
			
		};
		
	 	// setup floating tool options panel in the editor
		pg.toolOptionPanel.setup(options, components, function(){
			fixedGroupPivot = null;
		});
		
		tool.activate();
	};

	
	return {
		options:options,
		activateTool : activateTool
	};
	
};