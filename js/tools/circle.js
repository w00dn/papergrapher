// circle tool
// adapted from the paperjs examples (Tools/Circles.html)

pg.tools.registerTool({
	id: 'circle',
	name: 'Circle'
});

pg.tools.circle = function() {
	var tool;
	
	var options = {};
	
	var activateTool = function() {
		tool = new Tool();
		
		var shape;
		var mouseDown;
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			mouseDown = event.downPoint;
			
			shape = new Shape.Ellipse({
				point: event.downPoint,
				size: 0
			});
			
			shape = pg.stylebar.applyActiveToolbarStyle(shape);
		};
		
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var ex = event.point.x;
			var ey = event.point.y;
			
			if(event.modifiers.shift) {
				shape.size = new Point(mouseDown.x - ex, mouseDown.x -ex);
			} else {
				shape.size = new Point(mouseDown.x - ex, mouseDown.y -ey);
			}
			if(event.modifiers.alt) {
				shape.position = mouseDown;
			} else {
				shape.position = mouseDown - shape.size *0.5;
			}
		};
		
		
		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			// convert shape to path
			shape.toPath(true);
			shape.remove();
			
			pg.undo.snapshot('circle');
		};
		
		tool.activate();
	};
	
	var deactivateTool = function() {
		tool.remove();
	};
	
	return {
		options: options,
		activateTool : activateTool,
		deactivateTool : deactivateTool
	};
	
};