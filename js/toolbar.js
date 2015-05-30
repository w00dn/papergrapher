// functions related to the toolbar

pg.toolbar = function() {
		
	var activeTool;
	var previousTool;
	
	var setup = function() {
				
		// setup tool icons and click functions
		
		$('.tool').each(function(index, value) {
			$(this).click(function() {
				var toolName = $(this).data('name');
				if(toolName && toolName.length > 0) {
					switchTool(pg.tools.newToolByName(toolName));
				} else {
					console.log('tool not found. check data-name attribute');
				}
			});
			$(this).css({
				'background-image': 'url(assets/tool_'+$(this).data('name')+'.svg)'
			});
		});
		
		$('#zoomSelect').change(function() {
			paper.view.zoom = this.value;
			updateZoom();
			this.value = '';
			this.blur();
		});
		
		// after setup, show!
		showToolbar();
		pg.settingsbar.update();
		
		// set select tool as starting tool. somehow needs to be delayed
		// TODO: better solution for waiting... callback ??
		setTimeout(function(){
			if(paper.tools.length > 0) {
				paper.tools[0].remove(); // remove default tool
			}
			switchTool(pg.tools.newToolByName('Select'));
		},300);
		
				
		// setup colorpicker
		setupColorPicker();

	};
	
		
	var setupColorPicker = function() {
		
		$("#fillColorInput").spectrum({
			color: null,
			allowEmpty:true,
			replacerClassName: "fillColorSpec",
			containerClassName: 'fillSpecContainer',
			clickoutFiresChange: true,
			showInput: true,
			showPalette: true,
			hideAfterPaletteSelect:true,
			chooseText: "OK",
			cancelText: "Cancel",
			preferredFormat: "rgb",
			palette: [
				['black', 'white']
			],
			beforeShow: function() {
				showInputBlocker(true);
			},
			change: function(color) {
				if($('.fillSpecContainer:visible')) {
					var stringColor = color ? color.toRgbString() : "";
					pg.selection.colorizeSelectedFill(stringColor);
					showInputBlocker(false);
				}
				colorsAreDefault = false;
			},
			hide: function() {
				showInputBlocker(false);
				colorsAreDefault = false;
			}
		});
		
		$('.fillSpecContainer .sp-choose').click(function() {
			pg.selection.colorizeSelectedFill(pg.style.getFillColor());
			showInputBlocker(false);
		});
		
		$('.fillColorSpec').attr('title', 'Fill color');

		$("#strokeColorInput").spectrum({
			color: "#000",
			allowEmpty:true,
			replacerClassName: "strokeColorSpec",
			containerClassName: 'strokeSpecContainer',
			clickoutFiresChange: true,
			showInput: true,
			showPalette: true,
			hideAfterPaletteSelect:true,
			chooseText: "OK",
			cancelText: "Cancel",
			preferredFormat: "rgb",
			palette: [
				['black', 'white']
			],
			beforeShow: function() {
				showInputBlocker(true);
			},
			change: function(color) {
				if($('.strokeSpecContainer:visible')) {
					var stringColor = color ? color.toRgbString() : ""; 
					pg.selection.colorizeSelectedStroke(stringColor);
					showInputBlocker(false);
				}
				colorsAreDefault = false;
			},
			hide: function() {
				showInputBlocker(false);
				colorsAreDefault = false;
			}
		});

		$('.strokeColorSpec').append('<div class="inner"></div>');
		
		$('.strokeSpecContainer .sp-choose').click(function() {
			pg.selection.colorizeSelectedStroke(pg.style.getStrokeColor());
			showInputBlocker(false);
		});
		
		$('.strokeColorSpec').attr('title', 'Stroke color');
		
		
		$('#colorSwitchButton').click(function() {
			pg.style.switchColors();
		});

	};
	

	var showToolbar = function() {
		$('#toolbar').css({'left':'-150px'}).show().animate({'left': '0px'}, 'slow');
	};
	
	
	var showInputBlocker = function(state) {
		if(state) {
			$('#colorInputBlocker').show();
		} else {
			$('#colorInputBlocker').hide();
		}
	};
	
	
	var getActiveTool = function() {
		return activeTool;
	};


	var getPreviousTool = function() {
		return previousTool;
	};


	var switchTool = function(tool, forced) {
		// don't switch to the same tool again unless "forced" is true
		if( activeTool && 
			activeTool.options.name === tool.options.name && 
			!forced) {
			return;
		}
		
		//don't assign a hidden tool to previous tool state
		//that is only useful/wanted for toolbar items
		if(activeTool && activeTool.options.type !== 'hidden') {
			previousTool = activeTool;
		}
		resetTools();
		pg.style.sanitizeSettings();
		tool.activateTool();
		activeTool = tool;
		$('.tool_'+tool.options.name+'').addClass('active');
		
		var palettePanel = $('.palettejs-panel');
		if(palettePanel.exists()) {
			palettePanel.draggable();
			
			if(paletteHasChangeableInput()) {
				// add tool reset button to panel.
				// this clears the jStorage for the current tool and reloads that
				// tool by switching to it again.
				var resetButton = $('<button>Reset</button>').click(function() {
					if(confirm('Reset tool options to default?')) {
						pg.tools.deleteLocalOptions(tool.options.name);
						switchTool(pg.tools.newToolByName(tool.options.name), true);

					}
				});
				palettePanel.append(resetButton);
				pg.tools.parseOptionLabels();

				try {
					tool.updateTool();
				} catch(e) {
					// tool has no updateTool
				}
			}
		}
	};
	
	// checks if a palette has changeable elements (input, textarea, checkbox, ...)
	// ignores input type=button since that is not changeable
	var paletteHasChangeableInput = function() {
		if($('.palettejs-panel input:not([type=button])').size() > 0) {
			return true;
		} else {
			return false;
		}
	};


	var resetTools = function() {
		if(activeTool !== undefined && activeTool !== null) {
			try {
				activeTool.deactivateTool();
			} catch(e) {
				// this tool has no (optional) deactivateTool function
			}
			for(var i=0; i < paper.tools.length; i++) {
				paper.tools[i].remove();
			}
		}
		$('.palettejs-panel').remove();
		$('.tool').removeClass('active');
		
	};

	
	var updateZoom = function() {
		$('#zoomInput').val(Math.round(paper.view.zoom*100));
	};
	

	return {
		setup: setup,
		getActiveTool: getActiveTool,
		getPreviousTool: getPreviousTool,
		switchTool: switchTool,
		resetTools: resetTools,
		updateZoom: updateZoom,
	};
	
}();

