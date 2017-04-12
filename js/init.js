// functions related to initializing pg

var pg = function() {
	
	var init = function() {
		paper.setup('paperCanvas');
		
		pg.settings.setup();
		
		pg.document.setup();
		
		pg.layer.setup();
				
		pg.export.setup();
		
		pg.text.setup();
		
		pg.menu.setup();
		
		pg.toolbar.setup();
		
		pg.stylebar.setup();
		
		pg.statusbar.setup();
		
		pg.input.setup();
		
		pg.undo.setup();
		
		pg.codeEditor.setup();
		
	};

	return {
		init:init
	};
	
}();

jQuery.ajaxSetup({ cache: false });

// set pg up on window load
jQuery(window).load(function() {
	pg.init();
	
	// fade out loading screen and reveal ui
	jQuery('#loadingScreen').addClass('disabled').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
		function () {
			jQuery(this).remove();
		});
	;
});
