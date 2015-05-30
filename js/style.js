

pg.style = function() {
	var colorsAreDefault = true;

	var getFillColor = function() {
		var value = $("#fillColorInput").spectrum("get");
		return value ? value.toRgbString() : null;
	};


	var getStrokeColor = function() {
		var value = $("#strokeColorInput").spectrum("get");
		return value ? value.toRgbString() : null;
	};
	
	
	var getOpacity = function() {
		var value = $('#opacityInput').val();
		return value ? value/100 : null;
	};
	
	
	var getBlendMode = function() {
		var value = $('#blendModeSelect').val();
		return value ? value : null;
	};
	
	
	var getStrokeWidth = function() {
		var value = $('#strokeInput').val();
		return value ? parseFloat(value) : null;
	};
	
	
	var getFontFamily = function() {
		var value = $('#fontFamilySelect').val();
		return value ? value : 'sans-serif';
	};
	
	
	var getFontWeight = function() {
		var value = $('#fontWeightSelect').val();
		return value ? value : null;
	};
	
	
	var getFontSize = function() {
		var value = $('#fontSizeSelect').val();
		return value ? parseFloat(value) : null;
	};


	var areColorsDefault = function() {
		return colorsAreDefault;
	};
	
	
	var setFillColor = function(color) {
		$("#fillColorInput").spectrum("set", color);
	};
	
	
	var setStrokeColor = function(color) {
		$("#strokeColorInput").spectrum("set", color);
	};
	
	
	var setOpacity = function(value, triggerChange) {
		var input = $('#opacityInput');
		if(value !== null) {
			input.val(value*100);
		} else {
			input.val('');
		}
		if(triggerChange) {
			input.trigger('change').blur();
		} else {
			input.blur();
		}
	};
	
	
	var setBlendMode = function(mode) {
		var select = $('#blendModeSelect');
		
		if(mode !== null) {
			select.val(mode);
		} else {
			select.val('');
		}
		
	};
	
	
	var setStrokeWidth = function(value, triggerChange) {
		//console.log('settin stroke to:', value);
		var input = $('#strokeInput');
		input.val(value);
		
		if(triggerChange) {
			input.trigger('change').blur();
		}
	};
	
	
	var setFontFamily = function(value) {
		$('#fontFamilySelect').val(value);
	};
	
	
	var setFontWeight = function(value) {
		$('#fontWeightSelect').val(value);
	};
	
	
	var setFontSize = function(value) {
		$('#fontSizeSelect').val(value);
	};

	
	var updateFromItem = function(item) {
		
		if(item.fillColor) {
			setFillColor(item.fillColor.toCSS());
		} else {
			setFillColor(null);
		}
		if(item.strokeColor) {
			setStrokeColor(item.strokeColor.toCSS());
		} else {
			setStrokeColor(null);
		}
		
		setStrokeWidth(item.strokeWidth);
		setOpacity(item.opacity);
		
		if(item.blendMode) {
			setBlendMode(item.blendMode);
		} else {
			setBlendMode(null);
		}
		
		setFontFamily(item.fontFamily);
		setFontWeight(item.fontWeight);
		setFontSize(item.fontSize);
	};
	
	
	var updateFromSelection = function() {
		var selectedItems = paper.project.selectedItems;
		var selectionFillColorString = null;
		var selectionStrokeColorString = null;
		var selectionOpacity = null;
		var selectionStrokeWidth = null;
		var selectionBlendMode = null;
		var selectionFontFamily = null;
		var selectionFontWeight = null;
		var selectionFontSize = null;
		
		for(var i=0; i<selectedItems.length; i++) {
			var item = selectedItems[i];
			
			var itemFillColorString = null;
			var itemStrokeColorString = null;
			
			if(item.fillColor) {
				// hack bc text items with null fill can't be detected by fill-hitTest anymore
				if(pg.item.isPointTextItem(item) && item.fillColor.toCSS() === 'rgba(0,0,0,0)') {
					itemFillColorString = null;
				} else {
					itemFillColorString = item.fillColor.toCSS();
				}
			}
			if(item.strokeColor) {
				itemStrokeColorString = item.strokeColor.toCSS();
			}
			
			// check every style against the first of the items
			if(i===0) {
				selectionFillColorString = itemFillColorString;
				selectionStrokeColorString = itemStrokeColorString;
				selectionOpacity = item.opacity;
				selectionStrokeWidth = item.strokeWidth;
				selectionBlendMode = item.blendMode;
				
				selectionFontFamily = item.fontFamily;
				selectionFontWeight = item.fontWeight;
				selectionFontSize = item.fontSize;
				selectionTextAlignment = item.justification;
			}
			
			if(itemFillColorString !== selectionFillColorString) {
				selectionFillColorString = null;
			}
			
			if(itemStrokeColorString !== selectionStrokeColorString) {
				selectionStrokeColorString = null;
			}
			
			if(selectionOpacity !== item.opacity) {
				selectionOpacity = null;
			}
			
			if(selectionBlendMode !== item.blendMode) {
				selectionBlendMode = null;
			}
			
			if(selectionStrokeWidth !== item.strokeWidth) {
				selectionStrokeWidth = null;
			}
			
			if(selectionFontFamily !== item.fontFamily) {
				selectionFontFamily = null;
			}
			
			if(selectionFontWeight !== item.fontWeight) {
				selectionFontWeight = null;
			}
			
			if(selectionFontSize !== item.fontSize) {
				selectionFontSize = null;
			}
			
		}
		
		setFillColor(selectionFillColorString);
		setStrokeColor(selectionStrokeColorString);
		
		setStrokeWidth(selectionStrokeWidth);
		
		if(selectionOpacity) {
			setOpacity(selectionOpacity);
		} else {
			setOpacity(null);
		}
		
		if(selectionBlendMode) {
			setBlendMode(selectionBlendMode);
		} else {
			setBlendMode(null);
		}
		
		setFontFamily(selectionFontFamily);
		setFontWeight(selectionFontWeight);
		setFontSize(selectionFontSize);
		
	};
	
		
	// sets all the selectable styles from the toolbar to the path and returns it
	// usually called from the tools when a new path is created
	var applyActiveToolbarStyle = function(item) {
		item.fillColor = getFillColor();
		item.strokeColor = getStrokeColor();
		item.opacity = getOpacity();
		item.strokeWidth = getStrokeWidth();
		item.blendMode = getBlendMode();
		item.fontFamily = getFontFamily();
		item.fontWeight = getFontWeight();
		item.fontSize = getFontSize();
		item.leading = getFontSize();
//		item.leading = getFontSize()*1.5;
		return item;
	};


	var switchColors = function() {
		colorsAreDefault = false;
		
		var currFillColor = getFillColor();
		var currStrokeColor = getStrokeColor();

		var currFillColorString = getFillColor(true);
		var currStrokeColorString = getStrokeColor(true);

		$('#strokeColorInput').spectrum("set", currFillColorString);
		$('#fillColorInput').spectrum("set", currStrokeColorString);

		pg.selection.colorizeSelectedFill(currStrokeColor);
		pg.selection.colorizeSelectedStroke(currFillColor);

		paper.view.update();
	};
	
	
	// mainly makes sure the user doesn't accidentally draw with no color or 
	// no opacity
	var sanitizeSettings = function() {
		// if a tool is selected and the opacity value is empty, set it to 1
		// otherwise the user draws something with opacity 0 and sees nothing
		var opacity = $('#opacityInput').val();
		if(opacity === "") {
			setOpacity(1);
		}
		var blendMode = $('#blendModeSelect').val();
		if(blendMode === "") {
			setBlendMode('normal');
		}

		if(!getFillColor() && !getStrokeColor()) {
			setFillColor('rgb(0,0,0)');
		}
		
		if(getStrokeWidth() === null) {
			setStrokeWidth(1);
		}
		
		if(getFontFamily() === null) {
			setFontFamily('sans-serif');
		}
		
		if(getFontWeight() === null) {
			setFontWeight('normal');
		}
		
		if(getFontSize() === null) {
			setFontSize(32);
		}

	};
	
	
	var blurInputs = function() {
		$('input, select, textarea, button').blur();
	};
	
	
	return {
		getFillColor: getFillColor,
		getStrokeColor: getStrokeColor,
		getOpacity: getOpacity,
		getBlendMode: getBlendMode,
		getStrokeWidth: getStrokeWidth,
		getFontFamily: getFontFamily,
		getFontWeight: getFontWeight,
		getFontSize: getFontSize,
		areColorsDefault: areColorsDefault,
		setFillColor: setFillColor,
		setStrokeColor: setStrokeColor,
		setOpacity: setOpacity,
		setStrokeWidth: setStrokeWidth,
		setFontFamily: setFontFamily,
		setFontWeight: setFontWeight,
		setFontSize: setFontSize,
		updateFromSelection: updateFromSelection,
		updateFromItem: updateFromItem,
		applyActiveToolbarStyle: applyActiveToolbarStyle,
		switchColors: switchColors,
		sanitizeSettings: sanitizeSettings,
		blurInputs: blurInputs
		
	};
	
}();