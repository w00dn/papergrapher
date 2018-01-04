// functions related to settings / localstorage

pg.settings = function () {
	var config;
	
	var setup = function() {
		jQuery.ajax({
			dataType: "json",
			url: 'config.json',
			async: false
		}).done(function(data) {
			
			config = data;
			var storageVersionNumber = localStorage.getItem("pg.version");
			if(storageVersionNumber && storageVersionNumber !== config.appVersion) {
				console.warn('Settings version mismatch. Reverting all settings to default for now.');
				// version mismatch. removing old settings for now...
				// some sort of version mismatch handling is needed here
				clearSettings();

			} else if(!storageVersionNumber) {
				setVersionNumber();
			}
			
			document.title = 'Papergrapher '+config.appVersion;
			
		}).error(function(jqXHR, textStatus, errorThrown) {
			console.error('Loading config.json failed: '+errorThrown);
		});
	};
	
	
	var getVersionNumber = function() {
		return config.appVersion;
	};
	
	
	var setVersionNumber = function() {
		// save version number in localStorage
		localStorage.setItem("pg.version", config.appVersion);
	};
	
	
	var clearSettings = function() {
		localStorage.clear();
		setVersionNumber();
	};

	
	return {
		getVersionNumber: getVersionNumber,
		setup: setup,
		clearSettings: clearSettings
	};

}();