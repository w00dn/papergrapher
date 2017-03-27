
pg.codeEditor = function(){
	
	var setup = function() {
		jQuery('#runScriptButton').click(function() {
			cleanup();
			runScript();
		});
		
		jQuery('#closeScriptButton').click(function() {
			cleanup();
			jQuery('#codeEditorContainer').hide();
		});
		
		jQuery('#clearConsoleButton').click(function() {
			jQuery('#consoleOutput').empty();
		});

	};
	
	
	var show = function() {
		if(loadEditorResources()) {
			jQuery('#codeEditorContainer').draggable();
			jQuery('#codeEditorContainer').css({'position':'absolute'});
			jQuery('#codeEditorContainer').show();
		
			(function () {
				var log = console.log;
				console.log = function () {
					//log.call(this, 'My Console!!!');
					var args = Array.prototype.slice.call(arguments);
					if(args[0] !== 'key') {
						jQuery('#consoleOutput').append('<span class="message">' + args + '</span>').scrollTop(99999);
					}
					log.apply(this, args);
				};
			}());
		}
	};

	
	var loadEditorResources = function() {
		if(!jQuery('#codeEditorCSS').exists()) {
			jQuery("<link />", {
				href: "css/codeEditor.css",
				rel: "stylesheet",
				id: "codeEditorCSS"
			}).appendTo("head", function() {
				return true;
			});
		};
	
		// dynamically load stacktrace.js if not loaded yet
		try {
			printStackTrace();
		} catch(error) {
			jQuery.getScript("js/lib/stacktrace.js")
			.fail(function (jqxhr, settings, exception) {
				console.log(exception);
				return false;
			});
		}
		
		// dynamically load taboverride.min.js if not loaded yet
		try {
			tabOverride.set();
		} catch(error) {
			jQuery.getScript("js/lib/taboverride.min.js")
			.done(function () {
				jQuery('#codeEditorArea').tabOverride(true);
				jQuery.fn.tabOverride.autoIndent(true);
			})
			.fail(function (jqxhr, settings, exception) {
				console.log(exception);
				return false;
			});
		}

		return true;
	};
	
	
	var runScript = function() {
		var codeString = jQuery('#codeEditorArea').val();
		
		try {
			jQuery('body').append('<script id="userScript">'+codeString+'</script>');
		} catch(error) {
			var trace = printStackTrace({e: error});
			var splitTrace = trace[0].split(':');
			var lineNumber = splitTrace[splitTrace.length-2];
			jQuery('#consoleOutput').append('<span class="error">Line '+lineNumber+': '+error.message+'</span>');
		}
		pg.undo.snapshot('codeEditor');
		paper.view.update();

	};
	
	
	var cleanup = function() {
		jQuery('#userScript').remove();
	};
	
	
	return {
		setup: setup,
		show: show
	};

}();
