// circle tool
// adapted from the paperjs examples (Tools/Circles.html)

pg.tools.circle = function() {
	var tool;
	
	var options = {
		name: 'Circle',
		type: 'toolbar',
	};
	
	var activateTool = function() {
		tool = new Tool();
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var path = new Path.Circle({
				center: event.downPoint,
				radius: (event.downPoint - event.point).length
			});

			path = pg.style.applyActiveToolbarStyle(path);
			// Remove this path on the next drag event:
			path.removeOnDrag();
		};
		
		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
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