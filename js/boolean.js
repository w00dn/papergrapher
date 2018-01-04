pg.boolean = function() {
	
	var booleanUnite = function(items, replaceWithResult) {
		items = items || pg.selection.getSelectedItems();
		replaceWithResult = replaceWithResult || true;
		
		var result;
		for(var i=0; i<items.length; i++) {
			if(i === 0) {
				result = items[0];
			}
			var temp = items[i].unite(result, {insert:false});
			result.remove();
			result = temp;
			items[i].remove();
		}
		
		if(replaceWithResult) {
			applyReplaceWithResult(items, result);
		}
		
		return result;
	};
	
	
	var booleanIntersect = function(items, replaceWithResult) {
		items = items || pg.selection.getSelectedItems();
		replaceWithResult = replaceWithResult || true;
		
		var main;
		var result;
		for(var i=0; i<items.length; i++) {
			if(i === 0) {
				main = items[0];
			} else {
				result = items[i].intersect(main, {insert:false});
				if(i+1 < items.length) {
					main = result;
				}
			}
			main.remove();
			items[i].remove();
		}
		
		if(replaceWithResult) {
			applyReplaceWithResult(items, result);
		}
		return result;
	};
	
	
	var booleanSubtract = function(items, replaceWithResult) {
		items = items || pg.selection.getSelectedItems();
		replaceWithResult = replaceWithResult || true;
		
		var main = items[0];
		var rem = [];
		for(var i=0; i<items.length; i++) {
			if(i>0) {
				rem.push(items[i]);
			}
		}
		var over = booleanUnite(rem);
		
		var result = main.subtract(over, {insert:false});
		over.remove();
		main.remove();
		
		if(replaceWithResult) {
			applyReplaceWithResult(items, result);
		}
		
		return result;
	};
	
	
	var booleanExclude = function(items, replaceWithResult) {
		items = items || pg.selection.getSelectedItems();
		replaceWithResult = replaceWithResult || true;
		
		var main = items[0];
		var result;
		for(var i=0; i<items.length; i++) {
			if(i > 0) {
				result = items[i].exclude(main, {insert:false});
				if(i+1 < items.length) {
					main = result;
				}
			}
			main.remove();
			items[i].remove();
		}
		
		if(replaceWithResult) {
			applyReplaceWithResult(items, result);
		}
		
		return result;
	};
	
	
	var booleanDivide = function(items, replaceWithResult) {
		items = items || pg.selection.getSelectedItems();
		replaceWithResult = replaceWithResult || true;
		
		var union = booleanUnite(items);
		var exclusion = booleanExclude(items);
		var subtraction = booleanSubtract([union, exclusion.clone()]);
		
		var group = new paper.Group();
		
		if(exclusion.children) {
			for(var i=0; i<exclusion.children.length; i++) {
				var child = exclusion.children[i];
				child.strokeColor = 'black';
				group.addChild(child);
				i--;
			}
		}
		subtraction.strokeColor = 'black';
		group.addChild(subtraction);
		
		if(replaceWithResult) {
			applyReplaceWithResult(items, group);
		}
		
		return group;

	};
	
	
	var applyReplaceWithResult = function(items, group) {
		jQuery.each(items, function(index, item) {
			item.remove();
		});
		pg.layer.getActiveLayer().addChild(group);
		
		pg.undo.snapshot('booleanOperation');
	};
	
	
	return {
		booleanUnite: booleanUnite,
		booleanIntersect: booleanIntersect,
		booleanSubtract: booleanSubtract,
		booleanExclude: booleanExclude,
		booleanDivide: booleanDivide
	};
	
}();