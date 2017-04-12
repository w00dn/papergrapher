// function related to groups and grouping

pg.group = function() {

	var groupSelection = function() {
		var items = pg.selection.getSelectedItems();
			if(items.length > 0) {
			var group = new paper.Group(items);
			pg.selection.clearSelection();
			pg.selection.setItemSelection(group, true);
			pg.undo.snapshot('groupSelection');
			jQuery(document).trigger('Grouped');
			return group;
		} else {
			return false;
		}
	};
	
	
	var ungroupSelection = function() {
		var items = pg.selection.getSelectedItems();
		ungroupItems(items);
		pg.statusbar.update();
	};
	
	
	var groupItems = function(items) {
		if(items.length > 0) {
			var group = new paper.Group(items);
			jQuery(document).trigger('Grouped');
			pg.undo.snapshot('groupItems');
			return group;
		} else {
			return false;
		}
	};


	// ungroup items (only top hierarchy)
	var ungroupItems = function(items) {
		var emptyGroups = [];
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(isGroup(item) && !item.data.isPGTextItem) {
				ungroupLoop(item, false);

				if(!item.hasChildren()) {
					emptyGroups.push(item);
				}
			}
		}

		// remove all empty groups after ungrouping
		for(var j=0; j<emptyGroups.length; j++) {
			emptyGroups[j].remove();
		}
		jQuery(document).trigger('Ungrouped');
		pg.undo.snapshot('ungroupItems');
	};


	var ungroupLoop = function(group, recursive) {
		// don't ungroup items that are no groups
		if(!group || !group.children || !isGroup(group)) return;
				
		group.applyMatrix = true;
		// iterate over group children recursively
		for(var i=0; i<group.children.length; i++) {
			var groupChild = group.children[i];
			if(groupChild.hasChildren()) {

				// recursion (groups can contain groups, ie. from SVG import)
				if(recursive) {
					ungroupLoop(groupChild, true);
				} else {
					groupChild.applyMatrix = true;
					group.layer.addChild(groupChild);
					i--;
				}

			} else {
				groupChild.applyMatrix = true;
				// move items from the group to the activeLayer (ungrouping)
				group.layer.addChild(groupChild);
				i--;
			}
		}
	};


	var getItemsGroup = function(item) {
		var itemParent = item.parent;

		if(isGroup(itemParent)) {
			return itemParent;
		} else {
			return null;
		}
	};


	var isGroup = function(item) {
		return pg.item.isGroupItem(item);
	};
	
	
	var isGroupChild = function(item) {
		var rootItem = pg.item.getRootItem(item);
		return isGroup(rootItem);
	};
	
	
	return {
		groupSelection: groupSelection,
		ungroupSelection: ungroupSelection,
		groupItems: groupItems,
		ungroupItems: ungroupItems,
		getItemsGroup: getItemsGroup,
		isGroup: isGroup,
		isGroupChild:isGroupChild
	};

}();