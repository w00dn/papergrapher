// eyedropper tool

pg.tools.registerTool({
	id: 'eyedropper',
	name: 'Eyedropper',
	usedKeys : {
		toolbar : 'i'
	}
});

pg.tools.eyedropper = function() {
	var tool;

	var options = {};

	var activateTool = function() {
				
		tool = new Tool();
			
		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 5 / paper.view.zoom
		};
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var hitResult = paper.project.hitTest(event.point, hitOptions);
			if (hitResult) {
				if(event.modifiers.option) {
					pg.undo.snapshot('applyToolbarStyles');
					pg.stylebar.applyActiveToolbarStyle(hitResult.item);
					
				} else {
					pg.stylebar.updateFromItem(hitResult.item);
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
		activateTool : activateTool
	};
};