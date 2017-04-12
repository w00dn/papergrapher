// functions related to the toolbar

pg.toolbar = function() {
		
	var activeTool;
	var previousTool;
	
	var setup = function() {
		setupToolList();
	};
	
	
	var setupToolList = function() {
		var toolList= pg.tools.getToolList();
		var $toolsContainer = jQuery('.toolsContainer');
		
		jQuery.each(toolList, function(index, tool) {
			if(tool.type == 'hidden') return true;
			
			var shortCutInfo = '';
			if(tool.usedKeys && tool.usedKeys.toolbar != '') {
				shortCutInfo = ' ('+(tool.usedKeys.toolbar).toUpperCase()+')';
			}
			var $tool = jQuery('<div class="tool_'+tool.id+' tool" data-id="'+tool.id+'" title="'+tool.name+shortCutInfo+'">');
			$tool.css({'background-image': 'url(assets/tools/tool_'+tool.id+'.svg)'});
			$tool.click(function() {
				switchTool(tool.id);
			});
			$toolsContainer.append($tool);
		});
		
		pg.statusbar.update();

		// set select tool as starting tool. timeout is needed...
		setTimeout(function(){
			if(paper.tools.length > 0) {
				paper.tools[0].remove(); // remove default tool
			}
			setDefaultTool();
		},300);
	};
	
	
	
	var getActiveTool = function() {
		return activeTool;
	};


	var getPreviousTool = function() {
		return previousTool;
	};


	var switchTool = function(toolID, forced) {
		try {
			var opts = pg.tools.getToolInfoByID(toolID);
			var tool = new pg.tools[toolID]();
			
			// writing the tool infos back into the tool.options object
			jQuery.each(opts, function(name, value) {
				tool.options[name] = value;
			});
			
			// don't switch to the same tool again unless "forced" is true
			if( activeTool && 
				activeTool.options.id === tool.options.id && 
				!forced) {
				return;
			}

			//don't assign a hidden tool to previous tool state
			//that is only useful/wanted for toolbar items
			if(activeTool && activeTool.options.type !== 'hidden') {
				previousTool = activeTool;
			}
			resetTools();
			pg.stylebar.sanitizeSettings();
			tool.activateTool();
			activeTool = tool;
			jQuery('.tool_'+toolID+'').addClass('active');

		} catch(error) {
			console.warn('The tool with the id "'+toolID+'" could not be loaded.', error);
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
		jQuery('.toolOptionPanel').remove();
		jQuery('.tool').removeClass('active');
	};
	
	
	var setDefaultTool = function() {
		switchTool('select');
	};
	
	
	return {
		setup: setup,
		getActiveTool: getActiveTool,
		getPreviousTool: getPreviousTool,
		switchTool: switchTool,
		resetTools: resetTools,
		setDefaultTool: setDefaultTool
	};
	
}();

