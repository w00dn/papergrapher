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

		//var importLayer = new paper.Layer({name: 'Import layer'});

		jQuery.get(file, function (data) {
			paper.project.importSVG(data, {expandShapes: true});

		}).done(function () {
			pg.undo.snapshot('importAndAddSVG');
			paper.project.view.update();
		});

	};
	
	
	return {
		importAndAddImage: importAndAddImage,
		importAndAddSVG: importAndAddSVG
	};
}();