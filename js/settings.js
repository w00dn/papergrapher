// functions related to settings / jStorage

pg.settings = function () {
	var config;
	
	var setup = function() {
		jQuery.getJSON('config.json', function(data) {
			config = data;
			var storageVersionNumber = jQuery.jStorage.get("pg.version");
			if(storageVersionNumber && storageVersionNumber != config.appVersion) {
				console.warn('Settings version mismatch. Reverting all settings to default for now.');
				// version mismatch. removing old settings for now...
				// some sort of version mismatch handling is needed here
				clearSettings();

			} else if(!storageVersionNumber) {
				setVersionNumber();
			}
			
			document.title = 'Papergrapher '+config.appVersion;
			
		}).error(function(jqXHR, textStatus, errorThrown) {
			console.log('Loading config.json failed: '+errorThrown);
		});
		
		
	};
	
	
	var getVersionNumber = function() {
		return config.appVersion;
	};
	
	
	var setVersionNumber = function() {
		// save version number in localStorage
		jQuery.jStorage.set("pg.version", config.appVersion);
	};
	
	
	var clearSettings = function() {
		jQuery.jStorage.flush();
		setVersionNumber();
	};
	
	
	return {
		getVersionNumber: getVersionNumber,
		setup: setup,
		clearSettings: clearSettings
	};

}();