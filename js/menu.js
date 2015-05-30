// function related to the main menu

pg.menu = function() {
	
	var topMenuButton = $('#appNav .topMenu>li');
	var subMenu = $('#appNav .subMenu');
	var subMenuButton = $('#appNav .subMenu>li');
	var menuInputBlocker = $('#menuInputBlocker');
	
	
	var setup = function() {
		
		// appMenu logic
		setupNavigationLogic();

		// file section
		setupFileSection();

		// edit section
		setupEditSection();

		// object section
		setupObjectSection();
		
		// select section
		setupSelectSection();
		
		// view section
		setupViewSection();
		
		// window section
		setupWindowSection();
		
		// after setup, show it!
		showMenu();

	};


	var setupNavigationLogic = function() {
		// toggle navigation bar class (for hover/click filtering)
		$('#appNav .topMenu').click(function() {
			$(this).toggleClass('active');
		});
		
		// click on topMenuButton sets active state on button and shows/hides 
		// submenu. also shows/hides inputblocker in the background (transparent)
		topMenuButton.click(function() {
			subMenu.hide();
			topMenuButton.not($(this)).removeClass('active');
			
			if($(this).hasClass('active')) {
				$(this).removeClass('active').children('ul').hide();
				
				menuInputBlocker.hide();
				
			} else {
				$(this).addClass('active').children('ul').slideDown(50);
				menuInputBlocker.show();
			}
		});
		
		// topMenuButtons unfold the menu if the nav bar is active (was clicked upon)
		// then hovering over topMenuButtons switches to the according submenu
		topMenuButton.hover(function(e) {
			if($(e.target).hasClass('topMenuButton')) {
				if($('#appNav .topMenu').hasClass('active')) {
					// default hiding of everything not this
					subMenu.hide();
					topMenuButton.not($(this)).removeClass('active');
					
					$(this).addClass('active').children('ul').slideDown(50);
				}
			}
		}, function() {
			
		});
		

		menuInputBlocker.click(function() {
			hideMenus();
		});
		
		subMenuButton.click(function(e) {
			hideMenus();
			e.stopPropagation();
		});

	};
	
	
	var setupFileSection = function() {
		
		$('.clearDocument_button').click(function() {
			if (confirm('Clear the document permanently?')) {
				pg.document.clear();
			}
		});
		
		$('.resetSettings_button').click(function() {
			if (confirm('Clear all document and tool settings?')) {
				pg.settings.clearSettings();
			}
		});

		// import click handler on hidden file input in menu
		$('#fileUploadSVG').fileupload({
			dataType: 'json',
			acceptFileTypes : /(\.|\/)(svg)$/i,
			done: function (e, data) {
				$.each(data.result.files, function (index, file) {
					pg.document.importAndAddSVG(file.url);
				});
			}
		});
		
		// import click handler on hidden file input in menu
		$('#fileUploadJSON').fileupload({
			dataType: 'json',
			acceptFileTypes : /(\.|\/)(json)$/i,
			done: function (e, data) {
				$.each(data.result.files, function (index, file) {
					pg.document.importAndAddJSON(file.url);
				});
			}
		});
		
		// import click handler on hidden file input in menu
		$('#fileUploadImage').fileupload({
			dataType: 'json',
			acceptFileTypes : /(\.|\/)(jpg|jpeg|gif|png)$/i,
			done: function (e, data) {
				$.each(data.result.files, function (index, file) {
					pg.document.importAndAddImage(file.url);
				});
			}
		});
		
		$('.importSVGFromURL_button').click(function() {
			var fileName = prompt("Paste URL to SVG", "http://");
			
			if(fileName) {
				jQuery.ajax({
					url:      fileName,
					dataType: 'text',
					type:     'GET',
					complete:  function(xhr){
						if(xhr.status === 200) {
							pg.document.importAndAddSVG(fileName);
						} else {
							alert("SVG couldn't be retrieved from the specified URL.");
						}
					}
				});
			}
			
		});
		
		
		$('.importImageFromURL_button').click(function() {
			var fileName = prompt("Paste URL to Image (jpg, png, gif)", "http://");
			
			if(fileName) {
				pg.document.importAndAddImage(fileName);
			}
			
		});

		// export click handler in menu
		$('.exportSVG_button').click(function() {
			pg.document.exportAndPromptSVG();
		});
		
		$('.exportJSON_button').click(function() {
			pg.document.exportAndPromptJSON();
		});
		
		$('.exportImage_button').click(function() {
			pg.document.exportAndPromptImage();
		});

	};
	
	
	var setupEditSection = function() {
		
		$('.undo_button').click(function() {
			pg.undo.undo();
		});
		
		$('.redo_button').click(function() {
			pg.undo.redo();
		});
		
		$('.copyToClipboard_button').click(function() {
			pg.edit.copySelectionToClipboard();
		});
		
		$('.pasteFromClipboard_button').click(function() {
			pg.edit.pasteObjectsFromClipboard();
		});
		
		$('.deleteSelection_button').click(function() {
			pg.selection.deleteSelection();
		});
	};
	
	
	var setupObjectSection = function() {
		$('.group_button').click(function() {
			pg.group.groupSelection();
		});

		$('.ungroup_button').click(function() {
			pg.group.ungroupItems(pg.selection.getSelectedItems());
		});

		$('.bringToFront_button').click(function() {
			pg.order.bringSelectionToFront();
		});

		$('.sendToBack_button').click(function() {
			pg.order.sendSelectionToBack();
		});
		
		$('.createCompoundPath_button').click(function() {
			pg.compoundPath.createFromSelection();
		});
		
		$('.releaseCompoundPath_button').click(function() {
			pg.compoundPath.releaseSelection();
		});
	};
	
	
	var setupSelectSection = function() {
				
		$('.selectAll_button').click(function() {
			pg.selection.selectAll();
		});

		$('.deselectAll_button').click(function() {
			pg.selection.clearSelection();
		});

		$('.invertSelection_button').click(function() {
			pg.selection.invertSelection();
		});
	};
	
	
	var setupViewSection = function() {
		
		$('.zoomIn_button').click(function() {
			pg.view.zoomBy(1.25);
		});
		
		$('.zoomOut_button').click(function() {
			pg.view.zoomBy(1/1.25);
		});
		
		$('.resetZoom_button').click(function() {
			pg.view.resetZoom();
		});
		
	};
	
	
	var setupWindowSection = function() {
		
		$('.scriptEditorButton').click(function() {
			pg.codeEditor.show();
		});
		
	};
	
	
	
	var showMenu = function() {
		$('#appNav')
			.css({'top':'-80px'})
			.animate({'top': '0px'}, 'slow');
	};
	
	
	var showContextMenu = function(event) {
		// check for selected items, so the right context menu can be opened
		if(paper.project.selectedItems.length > 0) {
			// create, append and position context menu for object context
			$('body').append("<nav class='appNav' id='appNavContextMenu'></nav>");
			
			var menu = $('#objectSubMenu')
				.clone(true)
				.appendTo('#appNavContextMenu')
				.show()
				.slideDown(50);
			
			menu.css({ 'position': 'absolute', 'top': event.pageY, 'left': event.pageX });
			
			$('#menuInputBlocker').show();
			
		} else {
			//create context menu for document context
		}
	};
	
	
	var hideMenus = function() {
		topMenuButton.removeClass('active');
		$('#appNav .topMenu').removeClass('active');
		subMenu.hide();
		hideContextMenu();
	};


	var hideContextMenu = function() {
		$('body').off('click.contextMenu');
		$('body>#appNavContextMenu').remove();
		menuInputBlocker.hide();
	};
	

	return {
		setup:setup,
		showContextMenu:showContextMenu,
		hideContextMenu:hideContextMenu
	};
	
}();

