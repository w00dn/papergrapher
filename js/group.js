// function related to groups and grouping

pg.group = function() {

	var groupSelection = function() {
		var group = new Group(pg.selection.getSelectedItems());
		pg.selection.clearSelection();
		pg.selection.setItemSelection(group, true);
		pg.undo.snapshot('groupSelection');
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
		pg.undo.snapshot('ungroupItems');
	};


	// ungroup items recursively (used when importing svg for example)
//	var ungroupItemsRecursively = function(selectedItems) {
//		
//		// temp
//		return;
//		
//		var emptyGroups = [];
//
//		// ungrouping groups
//		if(isGroup(selectedItems)) {
//			console.log(selectedItems);
//			ungroupLoop(selectedItems, true);
//			emptyGroups.push(selectedItems);
//
//		// ungrouping arrays of items/groups
//		} else {
//			for(var i=0; i<selectedItems.length; i++) {
//				if(isGroup(selectedItems[i])) {
//					ungroupLoop(selectedItems[i], true);
//					emptyGroups.push(selectedItems[i]);
//				}
//			}
//		}
//
//		// remove all empty groups after ungrouping
//		for(var j=0; j<emptyGroups.length; j++) {
//			console.log(emptyGroups[j]);
//			//emptyGroups[j].remove();
//		}
//	};


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
		return item.className === 'Group';
	};

	
	return {
		groupSelection: groupSelection,
		ungroupItems: ungroupItems,
//		ungroupItemsRecursively: ungroupItemsRecursively,
		getItemsGroup: getItemsGroup,
		isGroup: isGroup
	};

}();