// exportRect tool

pg.tools.exportrect = function() {
	var tool;
	var path;
	var rect;
	
	var options = {
		name: 'ExportRect',
		posX: -100,
		posY: -100,
		width: 200,
		height: 200
	};
	
	var components = {
		posX: {
			type: 'int',
			label: 'Pos X'
		},
		posY: {
			type: 'int',
			label: 'Pos Y'
		},
		width: {
			type: 'int',
			label: 'Width',
			min: 1
		},
		height: {
			type: 'int',
			label: 'Height',
			min: 1
		}
	};
	
	
	var activateTool = function() {
		tool = new Tool();
		
		if(pg.export.getExportRect()) {
			options.posX = pg.export.getExportRect().x;
			options.posY = pg.export.getExportRect().y;
			options.width = pg.export.getExportRect().width;
			options.height = pg.export.getExportRect().height;
		} else {
			// get options from local storage if present
			options = pg.tools.getLocalOptions(options);
		}
		
		rect = new Rectangle(options.posX, options.posY, options.width, options.height);
		drawRect();
		
		pg.export.setExportRect(rect);
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			if(event.modifiers.shift) {
				var width = event.point.x - event.downPoint.x;
				rect = new Rectangle(event.downPoint.x, event.downPoint.y, width, width);
			} else {
				rect = new Rectangle(event.downPoint, event.point);
			}
			drawRect();
			
			options.posX = parseInt(event.downPoint.x);
			options.posY = parseInt(event.downPoint.y);
			options.width = parseInt(event.point.x - event.downPoint.x);
			options.height = parseInt(event.point.y - event.downPoint.y);
			
			pg.toolOptionPanel.update(options);
			
		};
		
		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			pg.export.setExportRect(rect);
			
			pg.undo.snapshot('exportrectangle');	
		};
		
		// setup floating tool options panel in the editor
		var $panel = pg.toolOptionPanel.setup(options, components, function() {
			rect = new Rectangle(options.posX, options.posY, options.width, options.height);
			pg.export.setExportRect(rect);
			drawRect();
		});
		
		// override reset button functionality, as this is a special case
		// this removes the export area from the document as if it never existed
		$panel.find('.toolOptionResetButton').text('Remove').unbind('click').click(function() {
			if(confirm('Remove export area?')) {
				pg.export.clearExportRect();
				pg.guides.removeExportRectGuide();
				pg.tools.deleteLocalOptions(options.name);
				pg.toolbar.setDefaultTool();
			}
		});
		
		tool.activate();
	};
	
	var drawRect = function() {
		pg.guides.removeExportRectGuide();
		path = new Path.Rectangle(rect);
		processPath();
		
	};
	
	var processPath = function() {
		path.guide = true;
		path.data.isExportRect = true;
		path.strokeWidth = 1.0 / paper.view.zoom;
		path.strokeColor = new Color(0.8, 0.8, 0.8);
		path.dashArray = [2 / paper.view.zoom, 4 / paper.view.zoom];
	};
	
	
	var deactivateTool = function() {
		
	};

	return {
		options: options,
		activateTool : activateTool,
		deactivateTool: deactivateTool
	};
};