pg.statusbar = function() {
	
	var setup = function() {
		setupZoomSelect();
	};
	
	
	var setupZoomSelect = function() {
		jQuery('#zoomSelect').change(function() {
			paper.view.zoom = this.value;
			update();
			this.value = '';
			this.blur();
		});
	};
	
	
	var update = function() {
		jQuery('#zoomInput').val(Math.round(paper.view.zoom*100));
		
		var selectionType = pg.selection.getSelectionType();
		if(selectionType) {
			jQuery('#selectionTypeLabel').html(selectionType).removeClass('none');
		} else {
			jQuery('#selectionTypeLabel').html('No selection').addClass('none');
		}
	};

	
	return {
		setup: setup,
		update: update
	};
	
}();