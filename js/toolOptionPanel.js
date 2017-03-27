pg.toolOptionPanel = function() {
	
	var setup = function(options, components, changeCallback) {
		var $panel = jQuery('<div class="palettejs-panel ui-draggable ui-draggable-handle"></div>');
		var $title = jQuery('<h3>'+options.name+'</h3>');
		var $options = jQuery('<div class="options">');

		jQuery.each(components, function(key, comp) {
			var $optionSection = jQuery('<div class="option-section" data-id="'+key+'">');
			var $label = jQuery('<label for="'+key+'">'+comp.label+'</label>');
			var $input;
			if(comp.type == 'boolean') {
				$input = jQuery('<input type="checkbox" name="'+key+'">');
				if(options[key]) {
					$input.attr('checked', true);
				}

			} else if(comp.type == 'int' || comp.type == 'float') {
				var minAttr = '';
				if(comp.min != undefined && comp.type == 'int') {
					minAttr = ' min="'+parseInt(comp.min)+'"';
					
				} else if(comp.min != undefined && comp.type == 'float') {
					minAttr = ' min="'+parseFloat(comp.min)+'"';
				}
				$input = jQuery('<input type="number" data-type="'+comp.type+'" name="'+key+'" value="'+options[key]+'"'+minAttr+'>');
				
			} else if(comp.type == 'list') {
				$input = jQuery('<select>');
				jQuery.each(comp.options, function(index, value) {
					var $opt = jQuery('<option value="'+value+'">'+value+'</option>');
					if(value == options[key]) {
						$opt.attr('selected', true);
					}
					$input.append($opt);
				});
			}
			
			// handle input changes by the user
			$input.on('keyup blur change mousewheel', function(e) {
				var val;
				if(e.target.type == 'checkbox') {
					val = e.target.checked;
					
				} else if(e.target.type == 'number') {
					var dataType = e.target.dataset.type;
					
					if(dataType == 'int') {
						val = parseInt(e.target.value);
						var min = parseInt(jQuery(this).attr('min'));
						
						if(!jQuery.isNumeric(val)) {
							val = min;
						} else if(min != undefined && min > val) {
							val = min;
							jQuery(this).val(min);
						}
						
					} else if(dataType == 'float') {
						val = parseFloat(e.target.value);
						var min = parseFloat(jQuery(this).attr('min'));
						if(!jQuery.isNumeric(val)) {
							val = min;
						} if(min != undefined && min > val) {
							val = min;
							jQuery(this).val(min);
						}
					}
					
				} else if(e.target.type == 'select-one') {
					val = e.target.value;
				}
				
				// set values for tool and save in local options
				options[key] = val;
				pg.tools.setLocalOptions(options);
				
				processInputRequirements();
				changeCallback();
			});

			$optionSection.append($label, $input);
			$options.append($optionSection);
		});

		var $resetButton = $('<button class="toolOptionResetButton">Reset</button>').click(function() {
			if(confirm('Reset tool options to default?')) {
				pg.tools.deleteLocalOptions(options.name);
				pg.toolbar.switchTool(pg.tools.newToolByName(options.name), true);
			}
		});

		$panel.append($title, $options, $resetButton);
		jQuery('body').append($panel);
		$panel.draggable();
		processInputRequirements();
		
		// shows/hides option-sections based on predefined requirements
		function processInputRequirements() {
			jQuery.each(components, function(reqid, comp){
				if(comp.requirements) {
					jQuery.each(comp.requirements, function(reqkey, req){
						console.log(reqkey, req);
						var $el = jQuery('.option-section[data-id="'+reqid+'"]');
						if(options[reqkey] == req) {
							$el.removeClass('hidden');
						} else {
							$el.addClass('hidden');
						}
					});
				}
			});
		};
		
		return $panel;
	};
	
	
	var update = function(options) {
		jQuery.each(options, function(key, opt) {
			var $el = jQuery('[name="'+key+'"]');
			if($el.attr('data-type') == 'int') {
				$el.val(parseInt(opt));
			} else if($el.attr('data-type') == 'float') {
				$el.val(parseFloat(opt));
			}
		});
	};
	
	
	return {
		setup: setup,
		update: update
	};
	
}();