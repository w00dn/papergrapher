
pg.codeEditor = function(){
	
	var $codeEditor;
	var wasInit;
	var defaultScript = 'console.log(\'Hello World!\')';
	
	var setup = function() {
		$codeEditor = jQuery('#codeEditorContainer');
		
		
		jQuery('#runScriptButton').click(function() {
			cleanup();
			runScript();
		});
		
		jQuery('#closeScriptButton').click(function() {
			cleanup();
			jQuery('#codeEditorContainer').addClass('hidden');
		});
		
		jQuery('#clearConsoleButton').click(function() {
			jQuery('#consoleOutput').children('span').remove();
		});
		
		jQuery('#codeEditorArea')[0].spellcheck = false;
		
		setupExamplesDropdown();
	};
	
	
	var toggleVisibility = function() {
		
		if($codeEditor.hasClass('hidden')) {
			if(!wasInit) {
				wasInit = true;
				loadEditorResources();
				(function () {
					var log = console.log;
					console.log = function () {
						var args = Array.prototype.slice.call(arguments);
						if(args[0] !== 'key') {
							jQuery('#consoleOutput').append('<span class="message">' + args + '</span>').scrollTop(99999);
						}
						log.apply(this, args);
					};
				}());
				$codeEditor.removeClass('hidden');
				
			} else {
				$codeEditor.removeClass('hidden');
			}
			paper.view.viewSize.width = jQuery('body').width()*0.5;
			jQuery('#paperCanvas').css({'width': '50%'});
			pg.view.resetPan();
			
		} else {
			cleanup();
			$codeEditor.addClass('hidden');
			paper.view.viewSize.width = jQuery('body').width();
			jQuery('#paperCanvas').css({'width': '100%'});
			pg.view.resetPan();
		}
	};

	
	var loadEditorResources = function() {
		jQuery("<link />", {
			href: "css/codeEditor.css",
			rel: "stylesheet",
			id: "codeEditorCSS"
		}).appendTo("head");
		
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
			jQuery('body').append('<script id="userScript">with(paper) {'+codeString+'}</script>');
		} catch(error) {
			var trace = printStackTrace({e: error});
			var splitTrace = trace[0].split(':');
			var lineNumber = splitTrace[splitTrace.length-2];
			jQuery('#consoleOutput').append('<span class="error">Line '+lineNumber+': '+error.message+'</span>');
		}
		pg.undo.snapshot('codeEditor');
		paper.view.update();

	};
	
	
	var setupExamplesDropdown = function() {
		var $li = jQuery('<li class="scriptExamplesDropdown">');
		var $select = jQuery('<select title="Script examples">');
		var $defaultOption = jQuery('<option value="default-script" selected>Default script</option>');
		
		$select.append($defaultOption);
		
		jQuery.getJSON('user/scripts/scripts.json', function(data) {
			jQuery.each(data.scripts, function(index, scriptID) {
				var $option = jQuery('<option value="'+scriptID+'">'+scriptID+'.js</option>');
				$select.append($option);
			});
		});
		
		$select.on('change', function() {
			var val = jQuery(this).val();
			loadScriptByID(val);
		});
		
		loadScriptByID('default-script');
		
		$li.append($select);
		
		jQuery('#codeEditorContainer .topMenu').append($li);
	};
	
	
	var loadScriptByID = function(scriptID) {
		if(scriptID === 'default-script') {
			jQuery('#codeEditorArea').val(defaultScript);
		} else {
			jQuery.ajax({
				url: 'user/scripts/'+scriptID+'.js',
				dataType: 'text',
				success: function(data) {
					jQuery('#codeEditorArea').val(data);
				}
			});
		}
	};
	
	var cleanup = function() {
		jQuery('#userScript').remove();
	};
	
	
	return {
		setup: setup,
		toggleVisibility: toggleVisibility
	};

}();
