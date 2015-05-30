
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
		$('#opacityInput').on('input change propertychange paste', function() {
			var opacity = pg.style.getOpacity();
			// check against null because opacity can be 0 and 0 is somehow
			// converted to null...
			if(opacity !== null) {
				pg.selection.setOpacity(opacity);
			}
		});
		
		$('#opacitySelect').on('change', function() {
			pg.style.setOpacity(this.value/100, true);
			this.value = '';
		});
	};
	
	
	var setupBlendSelect = function() {
		$('#blendModeSelect').on('change', function() {
			var mode = this.value;
			pg.selection.setBlendMode(mode);
		});
	};
	
	
	var setupStrokeSelect = function() {
		$('#strokeInput').on('input change propertychange paste', function() {
			pg.selection.setStrokeWidth(this.value);
			paper.view.update();
		}).blur();
		
		$('#increaseStrokeWidthButton').click(function(event) {
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
		
		$('#decreaseStrokeWidthButton').click(function(event) {
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
		$('#fontFamilySelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontFamily(value);
		});
	};
	
	
	var setupFontWeightSelect = function() {
		$('#fontWeightSelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontWeight(value);
		});
	};
	
	
	var setupFontSizeSelect = function() {
		$('#fontSizeSelect').on('change', function() {
			var value = this.value;
			pg.selection.setFontSize(value);
		});
	};
	
	
	var setupSwitchHandlesButton = function() {
		$('#switchHandlesButton').click(function() {
			pg.selection.switchSelectedHandles();
		});
	};
	
	
	var setupRemoveSegmentButton = function() {
		$('#removeSegmentButton').click(function() {
			pg.selection.removeSelectedSegments();
		});	
	};
	
	
	var setupSplitPathButton = function() {
		$('#splitPathButton').click(function() {
			pg.selection.splitPathAtSelectedSegments();
		});
	};
	
	
	var showSettingsBar = function() {
		$('#settingsBarContainer')
			.css({'top':'-80px'})
			.animate({'top': '30px'}, 'slow');
	};

	var showSection = function(type) {
		if(type === 'text') {
			$('.settingsBar').hide();
			$('#fontSettingsBar').show();
			
		} else if( type === 'segment') {
			$('.settingsBar').hide();
			$('#detailSelectionBar').show();
		}
		
		$('#styleSectionBar').show();
		$('#selectionInfoBar').show();
	};
	
	
	var hideSection = function(type) {
		if(type === 'text') {
			$('#fontSettingsBar').hide();
			
		} else {
			// hide everything
			$('.settingsBar').hide();
			
		}
		$('#styleSectionBar').show();
		$('#selectionInfoBar').show();
	};
	
	
	var update = function(item) {
		var selectionType = pg.selection.getSelectionType();
		
		$('#selectionTypeLabel').html(selectionType);
		
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