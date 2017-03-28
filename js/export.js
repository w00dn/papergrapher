// functions related to exporting

pg.export = function() {
	var exportRect;
	var canvas;
	
	var setup = function() {
		canvas = document.getElementById("paperCanvas");
	};
	
	
	var setExportRect = function(rect) {
		exportRect = rect;
	};
	
	
	var getExportRect = function() {
		return exportRect;
	};
	
	
	var clearExportRect = function() {
		exportRect = null;
	};
	
	
	var exportAndPromptImage = function() {
		var fileName = prompt("Name your file", "export.png");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			
			if(exportRect) {
				
				// backup guide items, then remove them before export
				var guideItems = pg.guides.getAllGuides();
				pg.guides.removeAllGuides();
				
				pg.view.resetZoom();
				pg.view.resetPan();
				paper.view.update();
				var offsetX = parseInt(canvas.width *0.5) + exportRect.x;
				var offsetY = parseInt(canvas.height *0.5) + exportRect.y;
				
				var fileNameNoExtension = fileName.split(".png")[0];
				var ctx = canvas.getContext("2d");
				var imgData = ctx.getImageData(offsetX, offsetY, exportRect.width, exportRect.height);

				var $tempCanvas = jQuery('<canvas width="'+exportRect.width+'" height="'+exportRect.height+'" style="position: absolute; z-index: -5;">');
				
				jQuery('body').append($tempCanvas);

				var context = $tempCanvas[0].getContext("2d");
				context.putImageData(imgData,0,0);
				$tempCanvas[0].toBlob(function(blob) {
					saveAs(blob, fileNameNoExtension+'.png');
				});

				// restore guide items after export
				pg.layer.getGuideLayer().addChildren(guideItems);
				
				$tempCanvas.remove();
				
			} else {
				pg.hover.clearHoveredItem();
				var fileNameNoExtension = fileName.split(".png")[0];
				canvas.toBlob(function(blob) {
					saveAs(blob, fileNameNoExtension+'.png');
				});
			}
		}
	};
	
	
	var exportAndPromptSVG = function() {
		var fileName = prompt("Name your file", "export.svg");

		if (fileName !== null) {
			pg.hover.clearHoveredItem();
			var fileNameNoExtension = fileName.split(".svg")[0];
			
			// backup guide items, then remove them before export
			var guideItems = pg.guides.getAllGuides();
			pg.guides.removeAllGuides();
			
			// export data, create blob  and save as file on users device
			var exportData = paper.project.exportSVG({ asString: true, bounds: exportRect });
			var blob = new Blob([exportData], {type: "image/svg+xml;charset=" + document.characterSet});
			saveAs(blob, fileNameNoExtension+'.svg');
			
			// restore guide items after export
			pg.layer.getGuideLayer().addChildren(guideItems);
		}
	};
	
	
	return {
		setup: setup,
		getExportRect: getExportRect,
		setExportRect: setExportRect,
		clearExportRect: clearExportRect,
		exportAndPromptImage: exportAndPromptImage,
		exportAndPromptSVG: exportAndPromptSVG
	};
	
}();