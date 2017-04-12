
pg.edit = function() {
	
	var copySelectionToClipboard = function() {
		pg.document.clearClipboard();
		var selectedItems = pg.selection.getSelectedItems();
		if(selectedItems.length > 0) {
			for(var i=0; i < selectedItems.length; i++) {
				var jsonItem = selectedItems[i].exportJSON({asString:false});
				pg.document.pushClipboard(jsonItem);
			}
		}
	};
	
	var pasteObjectsFromClipboard = function() {
		pg.undo.snapshot('pasteObjectsFromClipboard');
		pg.selection.clearSelection();
		
		var clipboard = pg.document.getClipboard();
		if(clipboard && clipboard.length > 0) {
			for(var i = 0; i < clipboard.length; i++) {
				var item = paper.Base.importJSON(clipboard[i]);
				if (item) {
					item.selected = true;
				}
				var placedItem = pg.layer.getActiveLayer().addChild(item);
				placedItem.position.x += 20;
				placedItem.position.y += 20;
			}
			paper.project.view.update();
		}
	};
	
	return {
		copySelectionToClipboard:copySelectionToClipboard,
		pasteObjectsFromClipboard:pasteObjectsFromClipboard
	};
	
}();