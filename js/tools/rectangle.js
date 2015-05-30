// rect tool

pg.tools.rectangle = function() {
	var tool;

	var options = {
		name: 'Rectangle',
		type: 'toolbar',
		roundedCorners: false,
		cornerRadius: 20
	};
	
	var components = {
		roundedCorners: {
			type: 'boolean',
			label: 'Rounded corners'
		},
		cornerRadius: {
			type: 'number',
			label: 'showOnRoundedCorners::Corner radius',
			step: 1
		}
	};
	
	var activateTool = function() {
				
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		
		tool = new Tool();
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var rect = new Rectangle(event.downPoint, event.point);
			var path;
			
			if(options.roundedCorners) {
				path = new Path.Rectangle(rect, options.cornerRadius);
			} else {
				path = new Path.Rectangle(rect);
			}
			
			path = pg.style.applyActiveToolbarStyle(path);

			// Remove this path on the next drag event:
			path.removeOnDrag();
		};
		
		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			pg.undo.snapshot('rectangle');	
		};
		
		var palette = new Palette('Options', components, options);
		palette.onChange = function(component, name, value) {
			updateTool();
		};
		
		tool.activate();
	};

	
	var updateTool = function() {
		
		if(options.roundedCorners === true) {
			$('.showOnRoundedCorners').show();
		} else {
			$('.showOnRoundedCorners').hide();
		}
		
		// write the options to jStorage when a value changes
		pg.tools.setLocalOptions(options);
		
	};
	
	return {
		options: options,
		activateTool : activateTool,
		updateTool: updateTool
	};
};