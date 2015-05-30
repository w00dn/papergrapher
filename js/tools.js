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
				
			case 'ViewZoom':
				return new pg.tools.viewZoom();
			
			case 'ViewGrab':
				return new pg.tools.viewGrab();
				
			case 'Test':
				return new pg.tools.test();
		}
	};
	
	
	var parseOptionLabels = function() {
		// fix names
		$('.palettejs-panel label').each( function(index) {
			var element = $(this);
			var labelString = $(this).text();
			
			// remove empty labels
			if(labelString.length === 0) {
				$(this).remove();
			}
			
			// add class to the label container that needs visibility toggle
			if(labelString.indexOf("::") >= 0) {
				var splitString = labelString.split('::');
				labelString = splitString[1];
				var elementClass = splitString[0];
				element.parent().parent().addClass(elementClass);

			}

			$(this).text(labelString);
		});
	};

	
	// jStorage 
	var getLocalOptions = function(options) {
		var storageJSON = $.jStorage.get('pg.tools.'+options.name);
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
		$.jStorage.set('pg.tools.'+options.name, optionsJSON);
		pg.style.blurInputs();
	};
	
	
	var deleteLocalOptions = function(name) {
		$.jStorage.deleteKey('pg.tools.'+name);
	};
	
	
	return {
		newToolByName: newToolByName,
		parseOptionLabels: parseOptionLabels,
		getLocalOptions: getLocalOptions,
		setLocalOptions: setLocalOptions,
		deleteLocalOptions: deleteLocalOptions
	};
		
}();