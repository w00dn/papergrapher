// functions related to guide items

pg.guides = function() {
	
	var guideBlue = '#009dec';
	var guideGrey = '#aaaaaa';
	
	var hoverItem = function(hitResult) {
		var segments = hitResult.item.segments;
		var clone = new paper.Path(segments);
		setDefaultGuideStyle(clone);
		clone.closed = true;
		clone.parent = pg.layer.getGuideLayer();
		clone.strokeColor = guideBlue;
		clone.fillColor = null;
		clone.data.isHelperItem = true;
		clone.bringToFront();

		return clone;
	};
	
	
	var hoverBounds = function(hitResult) {
		var rect = new paper.Path.Rectangle(hitResult.item.internalBounds);
		rect.matrix = hitResult.item.matrix;
		setDefaultGuideStyle(rect);
		rect.parent = pg.layer.getGuideLayer();
		rect.strokeColor = guideBlue;
		rect.fillColor = null;
		rect.data.isHelperItem = true;
		rect.bringToFront();

		return rect;
	};
	
	
	var rectSelect = function(event, color) {
		var half = new paper.Point(0.5 / paper.view.zoom, 0.5 / paper.view.zoom);
		var start = event.downPoint.add(half);
		var end = event.point.add(half);
		var rect = new paper.Path.Rectangle(start, end);
		var zoom = 1.0/paper.view.zoom;
		setDefaultGuideStyle(rect);
		if(!color) color = guideGrey;
		rect.parent = pg.layer.getGuideLayer();
		rect.strokeColor = color;
		rect.data.isRectSelect = true;
		rect.data.isHelperItem = true;
		rect.dashArray = [3.0*zoom, 3.0*zoom];
		return rect;
	};
	
	
	var line = function(from, to, color) {
		var line = new paper.Path.Line(from, to);
		var zoom = 1/paper.view.zoom;
		setDefaultGuideStyle(line);
		if (!color) color = guideGrey;
		line.parent = pg.layer.getGuideLayer();
		line.strokeColor = color;
		line.strokeColor = color;
		line.dashArray = [5*zoom, 5*zoom];
		line.data.isHelperItem = true;
		return line;
	};


	var crossPivot = function(center, color) {
		var zoom = 1/paper.view.zoom;
		var star = new paper.Path.Star(center, 4, 4*zoom, 0.5*zoom);
		setDefaultGuideStyle(star);
		if(!color) color = guideBlue;
		star.parent = pg.layer.getGuideLayer();
		star.fillColor = color;
		star.strokeColor = color;
		star.strokeWidth = 0.5*zoom;
		star.data.isHelperItem = true;
		star.rotate(45);

		return star;
	};
	
	
	var rotPivot = function(center, color) {
		var zoom = 1/paper.view.zoom;
		var path = new paper.Path.Circle(center, 3*zoom);
		setDefaultGuideStyle(path);
		if(!color) color = guideBlue;
		path.parent = pg.layer.getGuideLayer();
		path.fillColor = color;
		path.data.isHelperItem = true;

		return path;
	};
	
	
	var label = function(pos, content, color) {
		var text = new paper.PointText(pos);
		if(!color) color = guideGrey;
		text.parent = pg.layer.getGuideLayer();
		text.fillColor = color;
		text.content = content;
	};
	
	
	var setDefaultGuideStyle = function(item) {
		item.strokeWidth = 1/paper.view.zoom;
		item.opacity = 1;
		item.blendMode = 'normal';
		item.guide = true;
	};
	
	
	var getGuideColor = function(colorName) {
		if(colorName == 'blue') {
			return guideBlue;
		} else if(colorName == 'grey') {
			return guideGrey;
		}
	};
	
	
	var getAllGuides = function() {
		var allItems = [];
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			for(var j=0; j<layer.children.length; j++) {
				var child = layer.children[j];
				// only give guides
				if(!child.guide) {
					continue;
				}
				allItems.push(child);
			}
		}
		return allItems;
	};
	
	
	var removeHelperItems = function() {
		pg.helper.removePaperItemsByDataTags(['isHelperItem']);
	};
	
	
	var removeAllGuides = function() {
		pg.helper.removePaperItemsByTags(['guide']);
	};
	
	
	var removeExportRectGuide = function() {
		pg.helper.removePaperItemsByDataTags(['isExportRect']);
	};
	
	
	return {
		hoverItem: hoverItem,
		hoverBounds: hoverBounds,
		rectSelect: rectSelect,
		line: line,
		crossPivot: crossPivot,
		rotPivot: rotPivot,
		label: label,
		removeAllGuides: removeAllGuides,
		removeHelperItems: removeHelperItems,
		removeExportRectGuide: removeExportRectGuide,
		getAllGuides: getAllGuides,
		getGuideColor: getGuideColor,
		setDefaultGuideStyle:setDefaultGuideStyle
	};

}();
