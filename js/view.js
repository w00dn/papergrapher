

pg.view = function() {
	
	
	var zoomBy = function(factor) {
		paper.view.zoom *= factor;
		pg.toolbar.updateZoom();
	};
	
	
	var resetZoom = function() {
		paper.view.zoom = 1;
		pg.toolbar.updateZoom();
	};
	
	
	var resetPan = function() {
		paper.view.center = pg.document.getCenter();
	};
	
	
	return {
		zoomBy: zoomBy,
		resetZoom: resetZoom,
		resetPan: resetPan
	};
}();