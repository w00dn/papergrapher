
pg.order = function() {
	

	var bringSelectionToFront = function() {
		pg.undo.snapshot('bringSelectionToFront');
		var items = pg.selection.getSelectedItems();
		for(var i=0; i < items.length; i++) {
			items[i].bringToFront();
		}
	};

	var sendSelectionToBack = function() {
		pg.undo.snapshot('sendSelectionToBack');
		var items = pg.selection.getSelectedItems();
		for(var i=0; i < items.length; i++) {
			items[i].sendToBack();
		}
	};
	
	
	return {
		bringSelectionToFront:bringSelectionToFront,
		sendSelectionToBack:sendSelectionToBack
	};
	
}();