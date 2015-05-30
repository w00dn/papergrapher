// functions related to initializing pg

// root namespace
var pg = function() {
	
	var init = function() {
		paper.setup('paperCanvas');
		
		pg.settings.setup();
		
		pg.document.setup();

		pg.menu.setup();

		pg.toolbar.setup();
		
		pg.settingsbar.setup();

		pg.input.setup();
		
		pg.undo.setup();
		
		pg.codeEditor.setup();
		
	};

	return {
		init:init
	};
	
}();


paper.install(window);

// set pg up on window load
$( window ).load(function() {
	pg.init();
});
