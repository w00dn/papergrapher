// functions related to importing

pg.import = function () {

	var importAndAddImage = function (file) {
		if (!pg.helper.checkFileType(file, 'Image')) {
			return;
		}

		var raster = new paper.Raster({
			source: file,
			position: paper.view.center
		});
		pg.undo.snapshot('importImage');
	};


	var importAndAddSVG = function (file) {
		if (!pg.helper.checkFileType(file, 'SVG')) {
			return;
		}

		var importLayer = new paper.Layer({name: 'importLayer'});

		jQuery.get(file, function (data) {
			paper.project.importSVG(data, {expandShapes: true});

		}).done(function () {
			var importedItems = importLayer.children;

			// perform one ungroup if there is a single/empty group in the top group
			if (importedItems.length === 1 && pg.group.isGroup(importedItems[0]) && importedItems[0].children.length === 1 && pg.group.isGroup(importedItems[0].children[0])) {
				pg.group.ungroupItems(importedItems);
				pg.undo.removeLastState();
			}
			applyMatrixToItems(importLayer.children);
			paper.project.layers[0].addChildren(importLayer.children);
			paper.project.layers[0].activate();
			importLayer.remove();
			pg.undo.snapshot('importAndAddSVG');
			paper.project.view.update();
		});

	};
	
	
	// svg imported items need applyMatrix = true or strange stuff will happen
	// when transforming them with the tools
	var applyMatrixToItems = function(items) {
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			item.applyMatrix = true;
			if(pg.group.isGroup(item) || pg.layer.isLayer(item)) {
				if(item.children && item.children.length > 0) {
					applyMatrixToItems(item.children);
				}
			}
		}
	};

	return {
		importAndAddImage: importAndAddImage,
		importAndAddSVG: importAndAddSVG
	};
}();