
pg.view = function() {
	
	var zoomBy = function(factor) {
		paper.view.zoom *= factor;
		if(paper.view.zoom <= 0.01) {
			paper.view.zoom = 0.01;
		} else if(paper.view.zoom >= 1000) {
			paper.view.zoom = 1000;
		}
		pg.statusbar.update();
	};
	
	
	var resetZoom = function() {
		paper.view.zoom = 1;
		pg.statusbar.update();
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