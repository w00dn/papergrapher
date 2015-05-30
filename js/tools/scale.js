
pg.tools.scale = function() {
	var tool;
	
	var options = {
		name: 'Scale',
		type: 'toolbar',
		scaleCenter: 'selection',
		randomScale: false
	};
	
	var components = {
		scaleCenter: {
			type: 'list',
			label: 'Scale center',
			options: [ 'individual', 'selection', 'cursor' ],
			onChange: function() {
				updateTool();
			}
		},
		randomScale: {
			type: 'boolean',
			label: 'showOnIndividual::Random scale'
		}
	};
	
	var activateTool = function() {
		
		var selectedItems;
		var fixedGroupPivot;
		var pivotMarker = [];
		var randomSizes = [];
		var transformed = false;
		
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		
		tool = new Tool();
		
		tool.onMouseDown = function(event) {
			transformed = false;
			
			selectedItems = pg.selection.getSelectedItems();
			if(selectedItems.length === 0) return;
			
			if(options.scaleCenter === 'individual') {
				for(var i=0; i < selectedItems.length; i++) {
					pivotMarker.push(pg.guides.crossPivot(selectedItems[i].position));
				}
				if(options.randomScale) {		
					randomSizes = [];
					for(var i=0; i < selectedItems.length; i++) {
						randomSizes.push(Math.random()*0.005);
					}
				}
				
			} else {
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
				
				if(options.scaleCenter === 'cursor') {
					fixedGroupPivot = event.point;
				}
				
				// paint pivot guide
				pivotMarker[0] = pg.guides.crossPivot(fixedGroupPivot);
				
				
			}
		};
		
		tool.onMouseDrag = function(event) {
			if(selectedItems.length === 0) return;
			
			
			var amount = event.delta.normalize(0.03);
			amount.x += 1;
			amount.y += 1;
			//console.log(amount.x, amount.y);
						
			if(!event.modifiers.shift) {
				amount = amount.x * amount.y;
			}
			
			if(options.scaleCenter === 'individual') {
				
				for(var i=0; i < selectedItems.length; i++) {
					if(options.randomScale) {
						selectedItems[i].scale(amount+randomSizes[i], selectedItems[i].position);
					
					} else {
						selectedItems[i].scale(amount, selectedItems[i].position);
						
					}
				}
				
			} else {
				for(var i=0; i < selectedItems.length; i++) {
					selectedItems[i].scale(amount, fixedGroupPivot);
					var dist = fixedGroupPivot - event.point;
					var dragDir = 0;
					
					
					//console.log(dist, dist.normalize(1));
				}				
			};
			
			transformed = true;
		};
		
		tool.onMouseUp = function(event) {
			if(selectedItems.length === 0) return;
			
			for(var i=0; i < pivotMarker.length; i++) {
				pivotMarker[i].remove();
			}
			
			if(transformed) {
				pg.undo.snapshot('scale');
				transformed = false;
			}
		};
		
		// palette stuff
		var palette = new Palette('Options', components, options);
		
		palette.onChange = function(component, name, value) {
			fixedGroupPivot = null;
			updateTool();
		};
		
		tool.activate();
	};
	
	var updateTool = function() {
		
		if(options.scaleCenter === 'individual') {
			$('.showOnIndividual').show();
		} else {
			$('.showOnIndividual').hide();
		}
		
		// write the options to jStorage when a value changes
		pg.tools.setLocalOptions(options);
	};


	return {
		options:options,
		activateTool : activateTool,
		updateTool: updateTool
	};
};