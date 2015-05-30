

pg.compoundPath = function() {
	
	
	var isCompoundPath = function(item) {
		return item.className === 'CompoundPath';
	};
	
	
	var getItemsCompoundPath = function(item) {
		var itemParent = item.parent;

		if(isCompoundPath(itemParent)) {
			return itemParent;
		} else {
			return null;
		}
		
	};
	
	
	var createFromSelection = function() {
		var items = pg.selection.getSelectedPaths();
		if(items.length < 2) return;
		
		var path = new CompoundPath();
		
		for(var i=0; i<items.length; i++) {
			path.addChild(items[i]);
			items[i].selected = false;
		}
		
		path = pg.style.applyActiveToolbarStyle(path);
		
		pg.selection.setItemSelection(path, true);
		pg.undo.snapshot('createCompoundPathFromSelection');
	};
	
	
	var releaseSelection = function() {
		var items = pg.selection.getSelectedItems();
		
		var cPathsToDelete = [];
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			
			if(isCompoundPath(item)) {
				
				for(var j=0; j<item.children.length; j++) {
					var path = item.children[j];
					path.parent = paper.project.activeLayer;
					pg.selection.setItemSelection(path, true);
					j--;
				}
				//console.log('cpath:', item);
				cPathsToDelete.push(item);
				pg.selection.setItemSelection(item, false);
				
			} else {
				items[i].parent = paper.project.activeLayer;
			}
		}
		
		for(var j=0; j<cPathsToDelete.length; j++) {
			//console.log('ohai delete', cPathsToDelete[j]);
			cPathsToDelete[j].remove();
		}
		pg.undo.snapshot('releaseCompoundPath');
	};
	
	
	return {
		isCompoundPath: isCompoundPath,
		getItemsCompoundPath: getItemsCompoundPath,
		createFromSelection: createFromSelection,
		releaseSelection: releaseSelection,
	};
}();