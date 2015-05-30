

pg.tools.text = function() {
	var tool;
	var textItem;
	var toolMode = 'create';
	var quickMode = false;
	
	var options = {
		name: 'Text',
		type: 'toolbar'
	};
	
	var activateTool = function() {
		
		var hitItem;
		
		var hitOptions = {
			fill: true,
			class: PointText,
			tolerance: 5
		};
		
		tool = new Tool();
		
		// if the user hasn't changed the colors yet, switching to the text
		// tool will set the fillColor to black and the strokeColor to null
		// because currently, you can't click-select text with no fillColor
		if(pg.style.areColorsDefault()) {
			pg.style.setFillColor('rgb(0, 0, 0)');
			pg.style.setStrokeColor(null);
		};
		
		pg.selection.clearSelection();
		
		pg.settingsbar.showSection('text');
		
		tool.onMouseDown = function(event) {
			var hitResult = project.hitTest(event.point, hitOptions);
			
			
			if(hitResult && toolMode !== 'edit') {
				hitItem = hitResult;
				editItem(hitResult.item);
				
				
			} else {
				
				if(toolMode === 'edit') {
					finalizeInput(textItem);
					pg.undo.snapshot('text edit');
					
				} else {
					pg.selection.clearSelection();
					textItem = new PointText(event.point);
					
					textItem = pg.style.applyActiveToolbarStyle(textItem);
//					textItem.content = '';
//					textItem.leading = textItem.fontSize*1.5*paper.view.zoom;
//					var tiBounds = textItem.localToGlobal(textItem.internalBounds.bottomLeft);
//					pg.item.setPivot(textItem, tiBounds);
					pg.selection.setItemSelection(textItem, true);
					overlayInputField();
					
					toolMode = 'edit';
					pg.undo.snapshot('text create');
				}
			}
			
			pg.settingsbar.update();
			
		};
		
		tool.onMouseUp = function(event) {
			// somehow, some styles cannot be applied right after creation,
			// so we do it again in mouseUp
			textItem = pg.style.applyActiveToolbarStyle(textItem);
		};
		
		
		tool.activate();
	};
	
	
	var overlayInputField = function() {
//		var textContainerHeight = textItem.internalBounds.height * textItem.scaling.y;
		var input = $('<input id="fakeTextInput" class="fakeTextInput"></input>');
//		var tiView = pg.item.getPositionInView(textItem)*paper.view.zoom;
//		var textColor = pg.style.getFillColor();

		// if the fillColor is transparent we set it to black in the overlayInput
		// or the user wouldn't see what he's editing		
//		textColor = pg.style.isColorNull(textColor) ? 'black' : textColor;

		input.css({
			position : 'absolute',
			top: 80,
			left: 100,
//			top: tiView.y - textItem.internalBounds.height,
//			left: tiView.x,
//			height: textContainerHeight,
			zIndex : 10,
//			overflow: 'visible',
//			border : 0,
//			margin : 0,
//			padding : 0,
//			color: textColor, 
//			backgroundColor : 'transparent',
//			outline : 'none',
//			fontSize: textItem.fontSize * paper.view.zoom+'px',
//			fontFamily: textItem.fontFamily,
//			fontWeight: textItem.fontWeight,
//			fontStyle: textItem.fontWeight,
//			opacity: textItem.opacity,
//			'-moz-opacity': textItem.opacity,
//			'-khtml-opacity': textItem.opacity,
//			lineHeight : 1.5+'em',
//			'transform-origin' : 'bottom left',
//			'-webkit-transform' : 'rotate('+textItem.rotation+'deg) scale('+textItem.scaling.x+' , '+textItem.scaling.y+')',
//			   '-moz-transform' : 'rotate('+textItem.rotation+'deg) scale('+textItem.scaling.x+' , '+textItem.scaling.y+')',  
//				'-ms-transform' : 'rotate('+textItem.rotation+'deg) scale('+textItem.scaling.x+' , '+textItem.scaling.y+')',  
//			     '-o-transform' : 'rotate('+textItem.rotation+'deg) scale('+textItem.scaling.x+' , '+textItem.scaling.y+')',  
//					'transform' : 'rotate('+textItem.rotation+'deg) scale('+textItem.scaling.x+' , '+textItem.scaling.y+')'
		});
		

		$('body').append(input);
		var fakeTextInput = $('#fakeTextInput');
		fakeTextInput.focus();
		fakeTextInput.val(textItem.content);
//		textItem.content = '';
//		textItem.selected = false;
		fakeTextInput.keyup(function(event) {
			textItem.content = fakeTextInput.val();
			paper.project.view.update();
			if(event.keyCode === 13) {
				finalizeInput(textItem);
			}
		});
	};
	
	
	var finalizeInput = function(textItem) {
		var fakeTextInput = $('#fakeTextInput');
		if(fakeTextInput.exists()&& fakeTextInput.val() !== '') {
			textItem.content = fakeTextInput.val();
			fakeTextInput.remove();
		}
		pg.selection.setItemSelection(textItem, true);
		toolMode = 'create';
		pg.settingsbar.update();
		paper.project.view.update();
		
		if(quickMode) {
			pg.toolbar.switchTool(pg.toolbar.getPreviousTool());
			quickMode = false;
		}
	};
	
	
	var updateTool = function() {

	};
	
	var deactivateTool = function() {
		finalizeInput(textItem);
		pg.settingsbar.update();
	};
	
	var editItem = function(item) {
		toolMode = 'edit';
		textItem = item;
//		textItem.leading = textItem.fontSize*1.5*paper.view.zoom;
		pg.selection.clearSelection();
		pg.selection.setItemSelection(textItem, true);
//		var tiBounds = textItem.localToGlobal(textItem.internalBounds.bottomLeft);
		pg.style.updateFromSelection();
//		pg.item.setPivot(textItem, tiBounds);
		overlayInputField();
	};
	
	
	// called when a text item should be edited directly. quickMode means that
	// the tool is switched after the text input is finalized 
	// (ie. doubleclick on text items with select tools)
	var quickEditItem = function(item) {
		quickMode = true;
		setTimeout(function() {
			editItem(item);
		}, 100);
	};
	
	
	return {
		options: options,
		activateTool: activateTool,
		updateTool: updateTool,
		deactivateTool: deactivateTool,
		quickEditItem: quickEditItem
	};
};