
pg.order = function() {
	

	var bringSelectionToFront = function() {
		pg.undo.snapshot('bringSelectionToFront');
		var items = paper.project.selectedItems;
		for(var i=0; i < items.length; i++) {
			items[i].bringToFront();
		}
	};

	var sendSelectionToBack = function() {
		pg.undo.snapshot('sendSelectionToBack');
		var items = paper.project.selectedItems;
		for(var i=0; i < items.length; i++) {
			items[i].sendToBack();
		}
	};
	
	
	return {
		bringSelectionToFront:bringSelectionToFront,
		sendSelectionToBack:sendSelectionToBack,
	};
	
}();