// function related to groups and grouping

pg.group = function() {

	var groupSelection = function() {
		var group = new paper.Group(pg.selection.getSelectedItems());
		pg.selection.clearSelection();
		pg.selection.setItemSelection(group, true);
		pg.undo.snapshot('groupSelection');
		jQuery(document).trigger('Grouped');
		return group;
	};


	// ungroup items (only top hierarchy)
	var ungroupItems = function(selectedItems) {
		var emptyGroups = [];
		for(var i=0; i<selectedItems.length; i++) {
			if(isGroup(selectedItems[i])) {
				ungroupLoop(selectedItems[i], false);

				if(!selectedItems[i].hasChildren()) {
					emptyGroups.push(selectedItems[i]);
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
					paper.project.activeLayer.addChild(groupChild);
					i--;
				}

			} else {
				groupChild.applyMatrix = true;
				// move items from the group to the activeLayer (ungrouping)
				paper.project.activeLayer.addChild(groupChild);
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
		return item && item.className && item.className === 'Group';
	};

	
	return {
		groupSelection: groupSelection,
		ungroupItems: ungroupItems,
		getItemsGroup: getItemsGroup,
		isGroup: isGroup
	};

}();