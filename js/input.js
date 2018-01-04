// functions releated to input (mouse, keyboard)

pg.input = function() {
	
	var downKeys = [];
	var mouseIsDown = false;
	
	var setup = function () {
		setupKeyboard();
		setupMouse();
	};
	
	var setupKeyboard = function() {
		var toolList = pg.tools.getToolList();
		
		jQuery(document).unbind('keydown').bind('keydown', function (event) {

			if(!isKeyDown(event.keyCode)) {
				storeDownKey(event.keyCode);
			}
			
			// only prevent default keypresses (see tools/select.js for more)
			// ctrl-a / select all
			if (event.keyCode === 65 && event.ctrlKey) {
				if(!textIsSelected() && !userIsTyping(event)) {
					event.preventDefault();
				}
			}
			// ctrl-i / invert selection
			if (event.keyCode === 73 && event.ctrlKey) {
				event.preventDefault();
			}
			
			// ctrl-g / group
			if (event.keyCode === 71 && event.ctrlKey && !event.shiftKey) {
				event.preventDefault();
			}

			// ctrl-shift-g / ungroup
			if (event.keyCode === 71 && event.ctrlKey && event.shiftKey) {
				event.preventDefault();
			}


			// ctrl-1 / reset view to 100%
			if ((event.keyCode === 97 || 
				 event.keyCode === 49) &&
				 event.ctrlKey && 
				 !event.shiftKey) {

				event.preventDefault();
				pg.view.resetZoom();
			}

			// ctrl-z / undo
			if ((event.keyCode === 90) && event.ctrlKey && !event.shiftKey) {
				event.preventDefault();
				pg.undo.undo();
			}

			// ctrl-shift-z / undo
			if ((event.keyCode === 90) && event.ctrlKey && event.shiftKey) {
				event.preventDefault();
				pg.undo.redo();
			}

			// backspace / stop browsers "back" functionality
			if(event.keyCode === 8 && !userIsTyping(event)) {
				event.preventDefault();
			}


			// everything after this is blocked by mousedown!
			if(mouseIsDown) return;


			// alt
			if(event.keyCode === 18) {
				event.preventDefault();
			}

			// esc
			if(event.keyCode === 27) {
				pg.stylebar.blurInputs();
			}

			// space / pan tool
			if(event.keyCode === 32 && !userIsTyping(event)) {
				event.preventDefault();
				pg.toolbar.switchTool('viewgrab');
			}
		});


		jQuery(document).unbind('keyup').bind('keyup', function( event ) {

			// remove event key from downkeys
			var index = downKeys.indexOf(event.keyCode);
			if(index > -1) {
				downKeys.splice(index, 1);
			}


			// alt
			if(event.keyCode === 18) {
				// if viewZoom is active and we just released alt,
				// reset tool to previous
				if(pg.toolbar.getActiveTool().options.id === 'viewzoom') {
					pg.toolbar.switchTool(pg.toolbar.getPreviousTool().options.id);
				}
			}
			
			if(userIsTyping(event)) return;


			// space : stop pan tool on keyup
			if(event.keyCode === 32) {
				if(!isModifierKeyDown(event)) {
					event.preventDefault();
					pg.toolbar.switchTool(pg.toolbar.getPreviousTool().options.id);
				}
			}

			if(mouseIsDown) return;
			if(isModifierKeyDown(event)) return;


			// ----------------------------------------
			// keys that don't fire if modifier key down or mousedown or typing

			// backspace, delete : delete selection
			if(event.keyCode === 8 || event.keyCode === 46) {
				pg.selection.deleteSelection();
			}

			// x : switch color
			if(event.keyCode === 88) {
				pg.stylebar.switchColors();
			}

			// tool keys (switching to tool by key shortcut)
			jQuery.each(toolList, function(index, toolEntry) {
				if(toolEntry.usedKeys && toolEntry.usedKeys.toolbar) {
					if(event.keyCode === toolEntry.usedKeys.toolbar.toUpperCase().charCodeAt(0)) {
						pg.toolbar.switchTool(toolEntry.id);
					}
				}
			});
			
		});
	};
	
	
	var storeDownKey = function(keyCode) {
		if(downKeys.indexOf(keyCode) < 0) {
			downKeys.push(keyCode);
		}
	};
	
	
	var isMouseDown = function() {
		return mouseIsDown;
	};
	
	
	var isKeyDown = function(keyCode) {
		if(downKeys.indexOf(keyCode) < 0) {
			return false;
		} else {
			return true;
		}
	};
	
	
	var isModifierKeyDown = function(event) {
		if( event.altKey || 
			event.shiftKey || 
			event.ctrlKey || 
			(event.ctrlKey && event.altKey)) {
			return true;
		} else {
			return false;
		}
	};
	

	var textIsSelected = function() {
		if (window.getSelection().toString()) {
			return true;
		}
		if(document.selection && document.selection.createRange().text) {
			return true;
		}

		return false;
	};


	var userIsTyping = function(event) {		
		var d = event.srcElement || event.target;
		if ((d.tagName.toUpperCase() === 'INPUT' &&
			(
				d.type.toUpperCase() === 'TEXT' ||
				d.type.toUpperCase() === 'PASSWORD' ||
				d.type.toUpperCase() === 'FILE' || 
				d.type.toUpperCase() === 'EMAIL' ||
				d.type.toUpperCase() === 'SEARCH' ||
				d.type.toUpperCase() === 'DATE' ||
				d.type.toUpperCase() === 'NUMBER' )
			)
		|| d.tagName.toUpperCase() === 'TEXTAREA') {
			return true;
		}
		
		return false;
	};

	
	
	// mouse stuff

	var setupMouse = function() {

		jQuery('body').on('mousedown', function (e) {
			if ((e.which === 1)) { //left
				mouseIsDown = true;
			}
			if ((e.which === 3)) { // right
				
			}
			if ((e.which === 2)) { //middle
				
			}
			
			
		}).on('mouseup', function(e) {
			if ((e.which === 1)) { // left
				mouseIsDown = false;
			}
			if ((e.which === 2)) { // middle
				
			}
			if((e.which === 3)) { //right
				
			}

		}).on('contextmenu', function (e) {
			e.preventDefault();
			pg.menu.showContextMenu(e);
		});
		

		jQuery(window).bind('mousewheel DOMMouseScroll', function(event){
			if(event.altKey) {
				if (pg.toolbar.getActiveTool().options.id !== 'viewzoom') {
					pg.toolbar.switchTool('viewzoom');
				}
				if(pg.toolbar.getActiveTool()) {
					pg.toolbar.getActiveTool().updateTool(event);
				}
			}
		});
	};
	
	
	return {
		isMouseDown: isMouseDown,
		setup: setup,
		isModifierKeyDown: isModifierKeyDown,
		userIsTyping: userIsTyping,
		textIsSelected: textIsSelected
	};
		
}();

