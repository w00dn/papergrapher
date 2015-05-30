// bezier tool
// adapted from the paperjs examples (Tools/BezierTool.html)

pg.tools.test = function() {
	var tool;
	
	var options = {
		name: 'Test',
		type: 'toolbar'
	};
	
	var activateTool = function() {
		tool = new Tool();
		
		tool.onMouseDown = function(event) {
			var point = event.point;
			var path = new paper.Path.Circle(point, 4);
			path.fillColor = 'blue';
			
			pg.item.setPositionInView(path, new Point(300, 300));
			
		};
	};
	
	
	return {
		options: options,
		activateTool: activateTool
	};
};