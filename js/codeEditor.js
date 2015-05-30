
pg.codeEditor = function(){
	
	var setup = function() {
		$('#runScriptButton').click(function() {
			cleanup();
			runScript();
		});
		
		$('#closeScriptButton').click(function() {
			cleanup();
			$('#codeEditorContainer').hide();
		});
		
		$('#clearConsoleButton').click(function() {
			$('#consoleOutput').empty();
		});

	};
	
	
	var show = function() {
		if(loadEditorResources()) {
			$('#codeEditorContainer').draggable();
			$('#codeEditorContainer').css({'position':'absolute'});
			$('#codeEditorContainer').show();
		
			(function () {
				var log = console.log;
				console.log = function () {
					//log.call(this, 'My Console!!!');
					var args = Array.prototype.slice.call(arguments);
					if(args[0] !== 'key') {
						$('#consoleOutput').append('<span class="message">' + args + '</span>').scrollTop(99999);
					}
					log.apply(this, args);
				};
			}());
		}
	};

	
	var loadEditorResources = function() {
		if(!$('#codeEditorCSS').exists()) {
			$("<link />", {
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
			$.getScript("js/lib/stacktrace.js")
			.fail(function (jqxhr, settings, exception) {
				console.log(exception);
				return false;
			});
		}
		
		// dynamically load taboverride.min.js if not loaded yet
		try {
			tabOverride.set();
		} catch(error) {
			$.getScript("js/lib/taboverride.min.js")
			.done(function () {
				$('#codeEditorArea').tabOverride(true);
				$.fn.tabOverride.autoIndent(true);
			})
			.fail(function (jqxhr, settings, exception) {
				console.log(exception);
				return false;
			});
		}

		return true;
	};
	
	
	var runScript = function() {
		var codeString = $('#codeEditorArea').val();
		
		try {
			$('body').append('<script id="userScript">'+codeString+'</script>');
		} catch(error) {
			var trace = printStackTrace({e: error});
			var splitTrace = trace[0].split(':');
			var lineNumber = splitTrace[splitTrace.length-2];
			$('#consoleOutput').append('<span class="error">Line '+lineNumber+': '+error.message+'</span>');
			//$('#consoleOutput').append('<span class="error">'+error.message+' '+error.line+'</span>').scrollTop(99999);
		}

		//console.log(store[0]);
		//$('#consoleOutput').append(log);
		
		pg.undo.snapshot('codeEditor');
		paper.view.update();

	};
	
	
	var cleanup = function() {
		$('#userScript').remove();
	};
	
	
	return {
		setup: setup,
		show: show
	};

}();
