

pg.tools.text = function () {
	var tool;
	var textItem;
	var toolMode = 'create';
	var quickMode = false;

	var options = {
		name: 'Text'
	};

	var activateTool = function () {

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
		if (pg.style.areColorsDefault()) {
			pg.style.setFillColor('rgb(0, 0, 0)');
			pg.style.setStrokeColor(null);
		}
		;

		pg.selection.clearSelection();

		pg.settingsbar.showSection('text');

		tool.onMouseDown = function (event) {
			var hitResult = paper.project.hitTest(event.point, hitOptions);


			if (hitResult && toolMode !== 'edit') {
				hitItem = hitResult;
				editItem(hitResult.item);


			} else {

				if (toolMode === 'edit') {
					finalizeInput(textItem);
					pg.undo.snapshot('text edit');

				} else {
					pg.selection.clearSelection();
					textItem = new PointText(event.point);

					textItem = pg.style.applyActiveToolbarStyle(textItem);
					pg.selection.setItemSelection(textItem, true);
					overlayInputField();

					toolMode = 'edit';
					pg.undo.snapshot('text create');
				}
			}

			pg.settingsbar.update();

		};

		tool.onMouseUp = function (event) {
			// somehow, some styles cannot be applied right after creation,
			// so we do it again in mouseUp
			textItem = pg.style.applyActiveToolbarStyle(textItem);
		};


		tool.activate();
	};


	var overlayInputField = function () {
		var $input = jQuery('<input id="fakeTextInput" class="fakeTextInput"></input>');

		$input.css({
			position: 'absolute',
			top: 80,
			left: 100,
			zIndex: 10,
		});


		jQuery('body').append($input);
		var $fakeTextInput = jQuery('#fakeTextInput');
		$fakeTextInput.focus();
		$fakeTextInput.val(textItem.content);
		$fakeTextInput.keyup(function (event) {
			textItem.content = $fakeTextInput.val();
			paper.project.view.update();
			if (event.keyCode === 13) {
				finalizeInput(textItem);
			}
		});
	};


	var finalizeInput = function (textItem) {
		var $fakeTextInput = jQuery('#fakeTextInput');
		if ($fakeTextInput.exists() && $fakeTextInput.val() !== '') {
			textItem.content = $fakeTextInput.val();
			$fakeTextInput.remove();
		}
		pg.selection.setItemSelection(textItem, true);
		toolMode = 'create';
		pg.settingsbar.update();
		paper.project.view.update();

		if (quickMode) {
			pg.toolbar.switchTool(pg.toolbar.getPreviousTool());
			quickMode = false;
		}
	};


	var updateTool = function () {

	};

	var deactivateTool = function () {
		finalizeInput(textItem);
		pg.settingsbar.update();
	};

	var editItem = function (item) {
		toolMode = 'edit';
		textItem = item;
		pg.selection.clearSelection();
		pg.selection.setItemSelection(textItem, true);
		pg.style.updateFromSelection();
		overlayInputField();
	};


	// called when a text item should be edited directly. quickMode means that
	// the tool is switched after the text input is finalized 
	// (ie. doubleclick on text items with select tools)
	var quickEditItem = function (item) {
		quickMode = true;
		setTimeout(function () {
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