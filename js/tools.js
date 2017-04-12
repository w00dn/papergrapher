// functions related to tools

pg.tools = function() {
	var toolList = [];
	
	
	var registerTool = function(toolInfos) {
		toolList.push(toolInfos);
	};
	
	
	var getToolList = function() {
		return toolList;
	};
	
	
	var getToolInfoByID = function(id) {
		for(var i=0; i<toolList.length; i++) {
			if(toolList[i].id == id) {
				return toolList[i];
			}
		}
	};

	
	// localstorage
	var getLocalOptions = function(options) {
		var storageJSON = localStorage.getItem('pg.tools.'+options.id);
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
		localStorage.setItem('pg.tools.'+options.id, optionsJSON);
	};
	
	
	var deleteLocalOptions = function(id) {
		localStorage.removeItem('pg.tools.'+id);
	};
	
	
	return {
		registerTool: registerTool,
		getToolList: getToolList,
		getToolInfoByID: getToolInfoByID,
		getLocalOptions: getLocalOptions,
		setLocalOptions: setLocalOptions,
		deleteLocalOptions: deleteLocalOptions
	};
		
}();