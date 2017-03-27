// eyedropper tool

pg.tools.eyedropper = function() {
	var tool;

	var options = {
		name: 'Eyedropper'
	};

	var activateTool = function() {
				
		tool = new Tool();
			
		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 5
		};
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var hitResult = paper.project.hitTest(event.point, hitOptions);
			if (hitResult) {
				if(event.modifiers.option) {
					pg.undo.snapshot('applyToolbarStyles');
					pg.style.applyActiveToolbarStyle(hitResult.item);
					
				} else {
					pg.style.updateFromItem(hitResult.item);
				}
			}
		};
		
		tool.onMouseMove = function(event) {
			pg.hover.handleHoveredItem(hitOptions, event);
		};
		
		tool.activate();
	};

	
	
	
	return {
		options: options,
		activateTool : activateTool,
	};
};