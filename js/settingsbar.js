
pg.settingsbar = function() {
	
	var setup = function() {
		setupOpacitySelect();
		setupBlendSelect();
		setupStrokeSelect();
		setupFontFamilySelect();
		setupFontWeightSelect();
		setupFontSizeSelect();
		setupSwitchHandlesButton();
		setupRemoveSegmentButton();
		setupSplitPathButton();
		showSettingsBar();
	};
	
	
	var setupOpacitySelect = function() {
		jQuery('#opacityInput').on('input change propertychange paste', function() {
			var opacity = pg.style.getOpacity();
			// check against null because opacity can be 0 and 0 is somehow
			// converted to null...
			if(opacity !== null) {
				pg.selection.setOpacity(opacity);
			}
		});
		
		jQuery('#opacitySelect').on('change', function() {
			pg.style.setOpacity(this.value/100, true);
			this.value = '';
		});
	};
	
	
	var setupBlendSelect = function() {
		jQuery('#blendModeSelect').on('change', function() {
			var mode = this.value;
			pg.selection.setBlendMode(mode);
		});
	};
	
	
	var setupStrokeSelect = function() {
		jQuery('#strokeInput').on('input change propertychange paste', function() {
			pg.selection.setStrokeWidth(this.value);
			paper.view.update();
		}).blur();
		
		jQuery('#increaseStrokeWidthButton').click(function(event) {
			var currentStrokeWidth = parseFloat(pg.style.getStrokeWidth());
			var bonus = 0;
			if(event.shiftKey) {
				bonus = 10;
			}
			if(isNaN(currentStrokeWidth)) {
				pg.style.setStrokeWidth(1, true);
			} else {
				pg.style.setStrokeWidth(currentStrokeWidth+1+bonus, true);
			}
		});
		
		jQuery('#decreaseStrokeWidthButton').click(function(event) {
			var currentStrokeWidth = parseFloat(pg.style.getStrokeWidth());
			var bonus = 0;
			if(event.shiftKey) {
				bonus = 10;
			}
			if(isNaN(currentStrokeWidth)) {
				pg.style.setStrokeWidth(1, true);
			} else {
				if(currentStrokeWidth-(1+bonus) < 0) {
					pg.style.setStrokeWidth(0, true);
					
				} else {
					pg.style.setStrokeWidth(currentStrokeWidth-(1+bonus), true);
				}
			}
		});
	};
	
	
	var setupFontFamilySelect = function() {
		jQuery('#fontFamilySelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontFamily(value);
		});
	};
	
	
	var setupFontWeightSelect = function() {
		jQuery('#fontWeightSelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontWeight(value);
		});
	};
	
	
	var setupFontSizeSelect = function() {
		jQuery('#fontSizeSelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontSize(value);
		});
	};
	
	
	var setupSwitchHandlesButton = function() {
		jQuery('#switchHandlesButton').click(function() {
			pg.selection.switchSelectedHandles();
		});
	};
	
	
	var setupRemoveSegmentButton = function() {
		jQuery('#removeSegmentButton').click(function() {
			pg.selection.removeSelectedSegments();
		});	
	};
	
	
	var setupSplitPathButton = function() {
		jQuery('#splitPathButton').click(function() {
			pg.selection.splitPathAtSelectedSegments();
		});
	};
	
	
	var showSettingsBar = function() {
		
	};

	var showSection = function(type) {
		if(type === 'text') {
			jQuery('.settingsBar').hide();
			jQuery('#fontSettingsBar').show();
			
		} else if( type === 'segment') {
			jQuery('.settingsBar').hide();
			jQuery('#detailSelectionBar').show();
		}
		
		jQuery('#styleSectionBar').show();
		jQuery('#selectionInfoBar').show();
	};
	
	
	var hideSection = function(type) {
		if(type === 'text') {
			jQuery('#fontSettingsBar').hide();
			
		} else {
			// hide everything
			jQuery('.settingsBar').hide();
			
		}
		jQuery('#styleSectionBar').show();
		jQuery('#selectionInfoBar').show();
	};
	
	
	var update = function(item) {
		var selectionType = pg.selection.getSelectionType();
		
		jQuery('#selectionTypeLabel').html(selectionType);
		
		if(selectionType === 'Mixed') {
			hideSection();
			
		} else if(selectionType === 'Group') {
			hideSection();
			
		} else if(item && pg.item.isPointTextItem(item)) {
			showSection('text');
			
		} else if(pg.selection.getSelectionMode() === 'Segment') {
			showSection('segment');
		}
	};

	
	return {
		setup: setup,
		showSection: showSection,
		hideSection: hideSection,
		update: update
	};
}();