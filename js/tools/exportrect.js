// exportRect tool

pg.tools.exportrect = function() {
	var tool;
	var rect;
	var outerRect;
	
	var compoundPath;
	
	var options = {
		name: 'ExportArea',
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
				
		
		
		// if no options are set, try to get the current rect
		if(pg.export.getExportRect()) {
			options.posX = pg.export.getExportRect().x;
			options.posY = pg.export.getExportRect().y;
			options.width = pg.export.getExportRect().width;
			options.height = pg.export.getExportRect().height;
		} else {
			// get options from local storage if present
			options = pg.tools.getLocalOptions(options);
		}
		
		outerRect = new Rectangle(-500000, -500000, 1000000, 1000000);
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
			
			pg.tools.setLocalOptions(options);
			
			pg.undo.snapshot('exportrectangle');	
		};
		
		// setup floating tool options panel in the editor
		pg.toolOptionPanel.setup(options, components, function() {
			rect = new Rectangle(options.posX, options.posY, options.width, options.height);
			pg.export.setExportRect(rect);
			drawRect();
		});
		
		// override reset button... hacky...
		jQuery('.toolOptionResetButton').unbind('click').click(function() {
			if(confirm('Reset tool options to default?')) {
				pg.tools.deleteLocalOptions(options.name);
				pg.export.clearExportRect();
				pg.toolbar.switchTool(pg.tools.newToolByName(options.name), true);
			}
		});
		
		// this removes the export area from the document as if it never existed
		var $optionSection = jQuery('<div class="option-section" data-id="remove">');
		var $removeButton = jQuery('<button title="Remove Export Area">Remove</button>');
		$removeButton.click(function() {
			if(confirm('Remove export area?')) {
				pg.export.clearExportRect();
				pg.guides.removeExportRectGuide();
				pg.tools.deleteLocalOptions(options.name);
				pg.toolbar.setDefaultTool();
			}
		});
		$optionSection.append($removeButton);
		jQuery('.palettejs-panel .options').append($optionSection);
		
		tool.activate();
	};
	
	var drawRect = function() {
		pg.guides.removeExportRectGuide();
		compoundPath = new paper.CompoundPath({
			children: [ new Path.Rectangle(rect), new Path.Rectangle(outerRect) ],
			fillRule: 'evenodd',
			fillColor: 'black',
			opacity: 0.2,
			guide: true,
			data: {
				isExportRect: true,
				exportRectBounds : rect
			},
			parent: pg.layer.getGuideLayer()
		});
	};
	
	
	var deactivateTool = function() {
		
	};

	return {
		options: options,
		activateTool : activateTool,
		deactivateTool: deactivateTool
	};
};