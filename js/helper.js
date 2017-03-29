
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
	
	
	var checkFileType = function(file, fType) {
		var ext = getFileExtension(file);
		if(fType === 'Image') {
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'png':
				//etc
				//console.log('Image',file);
				return true;
			}
			
		} else if(fType === 'SVG') {
			switch (ext.toLowerCase()) {
			case 'svg':
				//console.log('SVG',file);
				return true;
			}
			
		} else if(fType === 'JSON') {
			switch (ext.toLowerCase()) {
			case 'json':
				//console.log('JSON',file);
				return true;
			}
			
		}
		alert('File type "'+ext+'" not supported.');
		return false;
	};
	
	
	var getFileExtension = function(filename) {
		var parts = filename.split('.');
		return parts[parts.length - 1];
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
			if(item.layer.id == id) {
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
	
	
	return {
		selectedItemsToJSONString: selectedItemsToJSONString,
		checkFileType: checkFileType,
		getAllPaperItems: getAllPaperItems,
		getPaperItemsByLayerID: getPaperItemsByLayerID,
		getPaperItemsByTags: getPaperItemsByTags,
		removePaperItemsByDataTags: removePaperItemsByDataTags,
		removePaperItemsByTags: removePaperItemsByTags,
		processFileInput:processFileInput
	};
	
}();