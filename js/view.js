

pg.view = function() {
	
	
	var zoomBy = function(factor) {
		paper.view.zoom *= factor;
		pg.toolbar.updateZoom();
	};
	
	
	var resetZoom = function() {
		paper.view.zoom = 1;
		pg.toolbar.updateZoom();
	};
	
	
	return {
		zoomBy: zoomBy,
		resetZoom: resetZoom
	};
}();