// functions related to the toolbar

pg.toolbar = function() {
		
	var activeTool;
	var previousTool;
	
	var setup = function() {
				
		// setup tool icons and click functions
		
		jQuery('.tool').each(function(index, value) {
			jQuery(this).click(function() {
				var toolName = jQuery(this).data('name');
				if(toolName && toolName.length > 0) {
					switchTool(pg.tools.newToolByName(toolName));
				} else {
					console.log('tool not found. check data-name attribute');
				}
			});
			jQuery(this).css({
				'background-image': 'url(assets/tool_'+jQuery(this).data('name')+'.svg)'
			});
		});
		
		jQuery('#zoomSelect').change(function() {
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
			setDefaultTool();
		},300);
		
				
		// setup colorpicker
		setupColorPicker();

	};
	
		
	var setupColorPicker = function() {
		
		jQuery("#fillColorInput").spectrum({
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
				if(jQuery('.fillSpecContainer:visible')) {
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
		
		jQuery('.fillSpecContainer .sp-choose').click(function() {
			pg.selection.colorizeSelectedFill(pg.style.getFillColor());
			showInputBlocker(false);
		});
		
		jQuery('.fillColorSpec').attr('title', 'Fill color');

		jQuery("#strokeColorInput").spectrum({
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
				if(jQuery('.strokeSpecContainer:visible')) {
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

		jQuery('.strokeColorSpec').append('<div class="inner"></div>');
		
		jQuery('.strokeSpecContainer .sp-choose').click(function() {
			pg.selection.colorizeSelectedStroke(pg.style.getStrokeColor());
			showInputBlocker(false);
		});
		
		jQuery('.strokeColorSpec').attr('title', 'Stroke color');
		
		
		jQuery('#colorSwitchButton').click(function() {
			pg.style.switchColors();
		});

	};
	

	var showToolbar = function() {
		
	};
	
	
	var showInputBlocker = function(state) {
		if(state) {
			jQuery('#colorInputBlocker').show();
		} else {
			jQuery('#colorInputBlocker').hide();
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
		jQuery('.tool_'+tool.options.name+'').addClass('active');
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
		jQuery('.palettejs-panel').remove();
		jQuery('.tool').removeClass('active');
		
	};
	
	
	var setDefaultTool = function() {
		switchTool(pg.tools.newToolByName('Select'));
	};
	
	
	var updateZoom = function() {
		jQuery('#zoomInput').val(Math.round(paper.view.zoom*100));
	};
	

	return {
		setup: setup,
		getActiveTool: getActiveTool,
		getPreviousTool: getPreviousTool,
		switchTool: switchTool,
		resetTools: resetTools,
		setDefaultTool: setDefaultTool,
		updateZoom: updateZoom
	};
	
}();

