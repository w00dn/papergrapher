// functions related to guide items

pg.guides = function() {
	
	var guideBlue = '#009dec';
	var guideGrey = 'grey';
	
	var hoverItem = function(hitResult) {
		var clone = hitResult.item.clone();
		setDefaultItemStyle(clone);
		clone.parent = paper.project.activeLayer;
		clone.strokeColor = guideBlue;
		clone.fillColor = null;
		clone.bringToFront();

		return clone;
	};
	
	
	var hoverBounds = function(hitResult) {
		var rect = new Path.Rectangle(hitResult.item.internalBounds);
		rect.matrix = hitResult.item.matrix;
		setDefaultItemStyle(rect);
		rect.strokeColor = guideBlue;
		rect.fillColor = null;
		rect.bringToFront();

		return rect;
	};
	
	
	var rectSelect = function(event, color) {
		var rect = new paper.Path.Rectangle(event.downPoint, event.point);
		var zoom = 1.0/paper.view.zoom;
		setDefaultItemStyle(rect);
		if(!color) color = guideGrey;
		rect.strokeColor = color;
		rect.dashArray = [5.0*zoom, 5.0*zoom];
		return rect;
	};
	
	
	var rect = function(rect, color) {
		var path = new paper.Path.Rectangle(rect);
		setDefaultItemStyle(path);
		if (!color) color = 'red';
		path.strokeColor = color;
		path.fillColor = null;

		return path;
	};
	
	
	var path = function(p, color) {
		var path = p.clone();
		setDefaultItemStyle(path);
		if (!color) color = 'red';
		path.strokeColor = color;
		path.fillColor = null;

		return path;
	};
	
	
	var line = function(from, to, color) {
		var line = new paper.Path.Line(from, to);
		var zoom = 1/paper.view.zoom;
		setDefaultItemStyle(line);
		if (!color) color = guideGrey;
		line.strokeColor = color;
		line.strokeColor = color;
		line.dashArray = [5*zoom, 5*zoom];
		return line;
	};


	var crossPivot = function(center, color) {
		var zoom = 1/paper.view.zoom;
		var star = new paper.Path.Star(center, 4, 4*zoom, 0.5*zoom);
		setDefaultItemStyle(star);
		if(!color) color = guideBlue;
		star.fillColor = color;
		star.strokeColor = color;
		star.strokeWidth = 0.5*zoom;
		star.rotate(45);

		return star;
	};
	
	
	var rotPivot = function(center, color) {
		var zoom = 1/paper.view.zoom;
		var path = new paper.Path.Circle(center, 3*zoom);
		setDefaultItemStyle(path);
		if(!color) color = guideBlue;
		path.fillColor = color;

		return path;
	};
	
	
	var label = function(pos, content, color) {
		var text = new PointText(pos);
		if(!color) color = guideGrey;
		text.fillColor = color;
		text.content = content;
	};
	
	
	var setDefaultItemStyle = function(item) {
		item.strokeWidth = 1/paper.view.zoom;
		item.opacity = 1;
		item.blendMode = 'normal';
		item.guide = true;
	};
	
	
	return {
		hoverItem: hoverItem,
		hoverBounds: hoverBounds,
		rectSelect: rectSelect,
		line: line,
		rect: rect,
		path: path,
		crossPivot: crossPivot,
		rotPivot: rotPivot,
		label: label
	};

}();
