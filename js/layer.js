
pg.layer = function() {
	
	var isLayer = function(item) {
		return item.className === "Layer";
	};
	
	
	var deselectAllLayers = function() {
		var selectedItems = paper.project.selectedItems;
		
		// first deselect layer
		for(var i=0; i<selectedItems.length; i++) {
			var item = selectedItems[i];
			if(isLayer(item)) {
				item.selected = false;
				//pg.selection.setItemSelection(item, false);
			}
		}
		// then select items again
		for(var i=0; i<selectedItems.length; i++) {
			var item = selectedItems[i];
			if(!isLayer(item)) {
				pg.selection.setItemSelection(item, true);
			}
		}
	};
	
	
	return {
		isLayer: isLayer,
		deselectAllLayers: deselectAllLayers
	};

}();