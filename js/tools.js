// functions related to tools

pg.tools = function() {
	
	var newToolByName = function(name) {
		switch(name) {				
			case 'Select':
				return new pg.tools.select();
			
			case 'DetailSelect':
				return new pg.tools.detailSelect();
				
			case 'Draw':
				return new pg.tools.draw();
				
			case 'Bezier':
				return new pg.tools.bezier();
				
			case 'Cloud':
				return new pg.tools.cloud();
				
			case 'BroadBrush':
				return new pg.tools.broadBrush();
				
			case 'Text':
				return new pg.tools.text();
				
			case 'Eyedropper':
				return new pg.tools.eyedropper();
				
			case 'Circle':
				return new pg.tools.circle();
			
			case 'Rectangle':
				return new pg.tools.rectangle();
			
			case 'Rotate':
				return new pg.tools.rotate();
			
			case 'Scale':
				return new pg.tools.scale();
				
			case 'Zoom':
				return new pg.tools.zoom();
				
			case 'ExportRect':
				return new pg.tools.exportrect();
				
			case 'ViewZoom':
				return new pg.tools.viewZoom();
			
			case 'ViewGrab':
				return new pg.tools.viewGrab();
		}
	};
	
	// jStorage 
	var getLocalOptions = function(options) {
		var storageJSON = jQuery.jStorage.get('pg.tools.'+options.name);
		if(storageJSON && storageJSON.length > 0) {
			var storageOptions = JSON.parse(storageJSON);
			
			// only overwrite options that are stored
			// new options will use their default value
			for(var option in options) {
				if(storageOptions.hasOwnProperty(option)) {
					options[option] = storageOptions[option];
				}
			}
		}
		return options;
	};
	
	
	var setLocalOptions = function(options) {
		var optionsJSON = JSON.stringify(options, null, 2);
		jQuery.jStorage.set('pg.tools.'+options.name, optionsJSON);
	};
	
	
	var deleteLocalOptions = function(name) {
		jQuery.jStorage.deleteKey('pg.tools.'+name);
	};
	
	
	return {
		newToolByName: newToolByName,
		getLocalOptions: getLocalOptions,
		setLocalOptions: setLocalOptions,
		deleteLocalOptions: deleteLocalOptions
	};
		
}();