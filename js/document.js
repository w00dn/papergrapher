
pg.document = function() {
	var center;
	var clipboard = [];

	
	var setup = function() {
		paper.view.center = new paper.Point(0,0);
		center = paper.view.center;
		
		// call DocumentUpdate at a reduced rate (every tenth frame)
		var int = 10;
		paper.view.onFrame = function() {
			if(int > 0) {
				int--;
			} else {
				jQuery(document).trigger('DocumentUpdate');
				int = 10;
			}
		};
		
		
		window.onbeforeunload = (function(e) {
			if(pg.undo.getStates().length > 1) {
				return 'Unsaved changes will be lost. Leave anyway?';
			}
		});
	};
	
	
	var clear = function() {
		paper.project.clear();
		pg.undo.clear();
		setup();
		pg.layer.setup();
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
	
	
	var getAllSelectableItems = function() {
		var allItems = pg.helper.getAllPaperItems();
		var selectables = [];
		for(var i=0; i<allItems.length; i++) {
			if(allItems[i].data && !allItems[i].data.isHelperItem) {
				selectables.push(allItems[i]);
			}
		}
		return selectables;
	};
	
	
	var loadJSONDocument = function(jsonString) {
		paper.project.clear();
		pg.toolbar.setDefaultTool();
		pg.export.setExportRect();

		paper.project.importJSON(jsonString);
		
		pg.layer.ensureGuideLayer();
		
		var exportRect = pg.guides.getExportRectGuide();
		if(exportRect) {
			pg.export.setExportRect(new paper.Rectangle(exportRect.data.exportRectBounds));
		}
		
		
		pg.layerPanel.updateLayerList();
		paper.view.update();
		pg.undo.snapshot('loadJSONDocument');
	};
	
	
	var saveJSONDocument = function() {
		var fileName = prompt("Name your file", "export.json");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			pg.selection.clearSelection();
			paper.view.update();
			
			var fileNameNoExtension = fileName.split(".json")[0];
			var exportData = paper.project.exportJSON({ asString: true });
			var blob = new Blob([exportData], {type: "text/json"});
			saveAs(blob, fileNameNoExtension+'.json');
		}
	};
	
	
	return {
		getCenter: getCenter,
		setup: setup,
		clear: clear,
		getClipboard: getClipboard,
		pushClipboard: pushClipboard,
		clearClipboard: clearClipboard,
		getAllSelectableItems: getAllSelectableItems,
		loadJSONDocument: loadJSONDocument,
		saveJSONDocument: saveJSONDocument
	};
		
}();