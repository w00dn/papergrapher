// functions related to settings / jStorage

pg.settings = function () {
	var versionNumber = '';
	
	
	var setup = function() {
		setVersionNumber();
	};
	
	
	var getVersionNumber = function() {
		return versionNumber;
	};
	
	
	var setVersionNumber = function() {
		// save version number in localStorage
		versionNumber = $.jStorage.get("pg.version");
		if(!versionNumber) {			
			versionNumber = $.jStorage.set("pg.version", "0.00001alphalol");
		}

	};
	
	
	var clearSettings = function() {
		$.jStorage.flush();
		setVersionNumber();
	};
	
	
	return {
		getVersionNumber: getVersionNumber,
		setup: setup,
		clearSettings: clearSettings
	};

}();