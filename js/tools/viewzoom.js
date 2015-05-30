// view zoom tool
// adapted from http://sketch.paperjs.org/

pg.tools.viewZoom = function() {
	var tool;
	var ePoint;
	
	var options = {
		name: 'ViewZoom',
		type: 'hidden'
	};
	
	var activateTool = function() {
		tool = new Tool();
		
		ePoint = view.center;
		
		tool.onMouseMove = function(event) {
			ePoint = event.point;
		};
		
		tool.activate();
	};
	
	
	var updateTool = function(updateInfo) {
						
		var factor = 1.25;
		if (updateInfo.originalEvent.wheelDelta > 0 || updateInfo.originalEvent.detail < 0) {
			// scroll up / zoom in

		} else {
			// scroll down / zoom out
			factor = 1 / factor;
		}
		
		view.center = ePoint;
		pg.view.zoomBy(factor);
		
		
	};
	
	
	return {
		options:options,
		activateTool : activateTool,
		updateTool: updateTool
	};
};



