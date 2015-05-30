
pg.document = function() {
	var center;
	var clipboard = [];
	var canvas;
	
	var setup = function() {
		canvas = document.getElementById("paperCanvas");
		center = paper.view.center;
	};
	
	
	var clear = function() {
		paper.project.clear();
		paper.view.center = center;
		paper.view.zoom = 1;
		pg.undo.clear();
		var layer = new Layer();
	};
	
	
	var getCenter = function() {
		return center;
	};
	
	
	var getClipboard = function() {
		return clipboard;	
	};
	
	
	var pushClipboard = function(item) {
		clipboard.push(item);
		return true;
	};
	
	
	var clearClipboard = function() {
		clipboard = [];
		return true;
	};
	
	
	var importAndAddImage = function(file) {
		if(!pg.helper.checkFileType(file, 'Image')) {
			return;
		}
		
		var raster = new paper.Raster({
			source: file,
			position: paper.view.center
		});
		pg.undo.snapshot('importImage');
	};
	
	
	var importAndAddSVG = function(file) {
		if(!pg.helper.checkFileType(file, 'SVG')) {
			return;
		}
		
		var importLayer = new Layer({name: 'importLayer'});
		
		$.get( file, function( data ) {
			paper.project.importSVG(data, {expandShapes:true});
			
		}).done(function() {
			var importedItems = importLayer.children;
			
			// perform one ungroup if there is a single/empty group in the top group
			if( importedItems.length === 1 && 
				pg.group.isGroup(importedItems[0]) &&
				importedItems[0].children.length === 1 &&
				pg.group.isGroup(importedItems[0].children[0])) { 
					pg.group.ungroupItems(importedItems);
					pg.undo.removeLastState();
				}
			pg.helper.applyMatrixToItems(importLayer.children);
			paper.project.layers[0].addChildren(importLayer.children);
			paper.project.layers[0].activate();
			importLayer.remove();
			pg.undo.snapshot('importAndAddSVG');
			paper.project.view.update();
		});
		
	};
	
	
	var importAndAddJSON = function(file) {
		
		var importLayer = new Layer({name: 'importLayer'});
		$.getJSON( file, function( data ) {
			paper.project.importJSON(data);
			
		}).done(function() {
			paper.project.layers[0].addChildren(importLayer.children);
			paper.project.layers[0].activate();
			importLayer.remove();
			paper.view.update();
			pg.undo.snapshot('importAndAddJSON');
		});
	};

	
	var exportAndPromptSVG = function() {
		var fileName = prompt("Name your file", "export.svg");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			var fileNameNoExtension = fileName.split(".svg")[0];
			var exportData = paper.project.exportSVG({ asString: true });
			var blob = new Blob([exportData], {type: "image/svg+xml;charset=" + document.characterSet});
			saveAs(blob, fileNameNoExtension+'.svg');
		}
	};
	
	
	var exportAndPromptJSON = function() {
		var fileName = prompt("Name your file", "export.json");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			var fileNameNoExtension = fileName.split(".json")[0];
			var exportData = paper.project.exportJSON({ asString: true });
			var blob = new Blob([exportData], {type: "text/json"});
			saveAs(blob, fileNameNoExtension+'.json');
		}
	};
	
	
	var exportAndPromptImage = function() {
		var fileName = prompt("Name your file", "export.png");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			var fileNameNoExtension = fileName.split(".png")[0];
			canvas.toBlob(function(blob) {
				saveAs(blob, fileNameNoExtension+'.png');
			});
		}
	};
	
	
	var getAllItems = function() {
		var allItems = [];
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			for(var j=0; j<layer.children.length; j++) {
				var child = layer.children[j];
				// don't give guides back
				if(child.guide) {
					continue;
				}
				allItems.push(child);
			}
		}
		return allItems;
	};
	
	
	return {
		getCenter: getCenter,
		setup: setup,
		clear: clear,
		getClipboard: getClipboard,
		pushClipboard: pushClipboard,
		clearClipboard: clearClipboard,
		importAndAddImage: importAndAddImage,
		importAndAddSVG: importAndAddSVG,
		importAndAddJSON: importAndAddJSON,
		exportAndPromptSVG: exportAndPromptSVG,
		exportAndPromptJSON: exportAndPromptJSON,
		exportAndPromptImage: exportAndPromptImage,
		getAllItems: getAllItems
	};
		
}();