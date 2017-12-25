
pg.helper = function() {
	
	var selectedItemsToJSONString = function() {
		var selectedItems = pg.selection.getSelectedItems();
		if(selectedItems.length > 0) {
			var jsonComp = '[["Layer",{"applyMatrix":true,"children":[';
			for(var i=0; i < selectedItems.length; i++) {
				var itemJSON = selectedItems[i].exportJSON({asString: true});
				if(i+1 < selectedItems.length) {
					itemJSON += ',';
				}
				jsonComp += itemJSON;
			}
			return jsonComp += ']}]]';
		} else {
			return null;
		}
	};
	
	
	var getAllPaperItems = function(includeGuides) {
		includeGuides = includeGuides || false;
		var allItems = [];
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			for(var j=0; j<layer.children.length; j++) {
				var child = layer.children[j];
				// don't give guides back
				if(!includeGuides && child.guide) {
					continue;
				}
				allItems.push(child);
			}
		}
		return allItems;
	};
		
	
	var getPaperItemsByLayerID = function(id) {
		var allItems = getAllPaperItems(false);
		var foundItems = [];
		jQuery.each(allItems, function(index, item) {
			if(item.layer.data.id == id) {
				foundItems.push(item);
			}
		});
		return foundItems;
	};
	
	
	var getPaperItemsByTags = function(tags) {
		var allItems = getAllPaperItems(true);
		var foundItems = [];
		jQuery.each(allItems, function(index, item) {
			jQuery.each(tags, function(ti, tag) {
				if(item[tag] && foundItems.indexOf(item) == -1) {
					foundItems.push(item);
				}
			});
		});
		return foundItems;
	};


	var removePaperItemsByDataTags = function(tags) {
		var allItems = getAllPaperItems(true);
		jQuery.each(allItems, function(index, item) {
			jQuery.each(tags, function(ti, tag) {
				if(item.data && item.data[tag]) {
					item.remove();
				}
			});
		});
	};
	
	
	var removePaperItemsByTags = function(tags) {
		var allItems = getAllPaperItems(true);
		jQuery.each(allItems, function(index, item) {
			jQuery.each(tags, function(ti, tag) {
				if(item[tag]) {
					item.remove();
				}
			});
		});
	};
	
	
	var processFileInput = function (dataType ,input, callback) {
		var reader = new FileReader();
		
		if(dataType == 'text') {
			reader.readAsText(input.files[0]);
			
		} else if(dataType == 'dataURL') {
			reader.readAsDataURL(input.files[0]);
		}
		
		reader.onload = function () {
			callback(reader.result);
		};
	};
	
	
	var executeFunctionByName = function (functionName, context /*, args */) {
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(context, args);
	};
	
	
	return {
		selectedItemsToJSONString: selectedItemsToJSONString,
		getAllPaperItems: getAllPaperItems,
		getPaperItemsByLayerID: getPaperItemsByLayerID,
		getPaperItemsByTags: getPaperItemsByTags,
		removePaperItemsByDataTags: removePaperItemsByDataTags,
		removePaperItemsByTags: removePaperItemsByTags,
		processFileInput:processFileInput,
		executeFunctionByName: executeFunctionByName
	};
	
}();