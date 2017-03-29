// function related to the main menu

pg.menu = function() {
	
	var $topMenuButton = jQuery('#appNav .topMenu>li');
	var $subMenu = jQuery('#appNav .subMenu');
	var $subMenuButton = jQuery('#appNav .subMenu>li');
	var $menuInputBlocker = jQuery('#menuInputBlocker');
	
	
	var setup = function() {
		setupNavigationLogic();
		setupFileSection();
		setupEditSection();
		setupObjectSection();
		setupSelectSection();
		setupViewSection();
		setupWindowSection();
		setupInfoSection();
		showMenu();
	};


	var setupNavigationLogic = function() {
		// toggle navigation bar class (for hover/click filtering)
		jQuery('#appNav .topMenu').click(function() {
			jQuery(this).toggleClass('active');
		});
		
		// click on $topMenuButton sets active state on button and shows/hides 
		// submenu. also shows/hides inputblocker in the background (transparent)
		$topMenuButton.click(function() {
			$subMenu.hide();
			$topMenuButton.not(jQuery(this)).removeClass('active');
			
			if(jQuery(this).hasClass('active')) {
				jQuery(this).removeClass('active').children('ul').hide();
				
				$menuInputBlocker.hide();
				
			} else {
				jQuery(this).addClass('active').children('ul').slideDown(50);
				$menuInputBlocker.show();
			}
		});
		
		// $topMenuButtons unfold the menu if the nav bar is active (was clicked upon)
		// then hovering over $topMenuButtons switches to the according submenu
		$topMenuButton.hover(function(e) {
			if(jQuery(e.target).hasClass('topMenuButton')) {
				if(jQuery('#appNav .topMenu').hasClass('active')) {
					// default hiding of everything not this
					$subMenu.hide();
					$topMenuButton.not(jQuery(this)).removeClass('active');
					
					jQuery(this).addClass('active').children('ul').slideDown(50);
				}
			}
		}, function() {
			
		});
		

		$menuInputBlocker.click(function() {
			hideMenus();
		});
		
		$subMenuButton.click(function(e) {
			hideMenus();
			e.stopPropagation();
		});

	};
	
	
	var setupFileSection = function() {
		
		jQuery('.clearDocument_button').click(function() {
			if (confirm('Clear the document permanently?')) {
				pg.document.clear();
			}
		});
	 
		jQuery('.resetSettings_button').click(function() {
			if (confirm('Clear all document and tool settings?')) {
				pg.settings.clearSettings();
			}
		});

		// handle change on hidden file input in menu item
		jQuery('#fileUploadSVG').on('change', function(event) {
			pg.helper.processFileInput('text', event.target, function(data) {
				pg.import.importAndAddSVG(data);
			});
		});
		
		// handle change on hidden file input in menu item
		jQuery('#fileUploadJSON').on('change', function(event) {
			pg.helper.processFileInput('text', event.target, function(data) {
				pg.document.loadJSONDocument(data);
			});
		});
		
		// handle change on hidden file input in menu item
		jQuery('#fileUploadImage').on('change', function(event) {
			pg.helper.processFileInput('dataURL', event.target, function(dataURL) {
				pg.import.importAndAddImage(dataURL);
			});
		});
		
		jQuery('.importSVGFromURL_button').click(function () {
			var fileName = prompt("Paste URL to SVG", "http://");
			if (fileName) {
				jQuery.ajax({
					url: fileName,
					dataType: 'text',
					type: 'GET',
					complete: function (xhr) {
						if (xhr.status === 200) {
							pg.import.importAndAddSVG(fileName);
						} else {
							alert("SVG couldn't be retrieved from the specified URL.");
						}
					}
				});
			}
		});
		
		jQuery('.importImageFromURL_button').click(function() {
			var fileName = prompt("Paste URL to Image (jpg, png, gif)", "http://");
			if(fileName) {
				pg.import.importAndAddImage(fileName);
			}
		});
		
		jQuery('.exportJSON_button').click(function() {
			pg.document.saveJSONDocument();
		});
		
		// export click handler in menu
		jQuery('.exportSVG_button').click(function() {
			pg.export.exportAndPromptSVG();
		});

		jQuery('.exportImage_button').click(function() {
			pg.export.exportAndPromptImage();
		});

	};
	
	
	var setupEditSection = function() {
		
		jQuery('.undo_button').click(function() {
			pg.undo.undo();
		});
		
		jQuery('.redo_button').click(function() {
			pg.undo.redo();
		});
		
		jQuery('.copyToClipboard_button').click(function() {
			pg.edit.copySelectionToClipboard();
		});
		
		jQuery('.pasteFromClipboard_button').click(function() {
			pg.edit.pasteObjectsFromClipboard();
		});
		
		jQuery('.deleteSelection_button').click(function() {
			pg.selection.deleteSelection();
		});
	};
	
	
	var setupObjectSection = function() {
		jQuery('.group_button').click(function() {
			pg.group.groupSelection();
		});

		jQuery('.ungroup_button').click(function() {
			pg.group.ungroupItems(pg.selection.getSelectedItems());
		});
		
		jQuery('.sendToActiveLayer_button').click(function() {
			pg.layer.addItemsToLayer(pg.selection.getSelectedItems(), paper.project.activeLayer);
		});
		
		jQuery('.bringToFront_button').click(function() {
			pg.order.bringSelectionToFront();
		});

		jQuery('.sendToBack_button').click(function() {
			pg.order.sendSelectionToBack();
		});
		
		jQuery('.createCompoundPath_button').click(function() {
			pg.compoundPath.createFromSelection();
		});
		
		jQuery('.releaseCompoundPath_button').click(function() {
			pg.compoundPath.releaseSelection();
		});
	};
	
	
	var setupSelectSection = function() {
				
		jQuery('.selectAll_button').click(function() {
			pg.selection.selectAll();
		});

		jQuery('.deselectAll_button').click(function() {
			pg.selection.clearSelection();
		});

		jQuery('.invertSelection_button').click(function() {
			pg.selection.invertSelection();
		});
	};
	
	
	var setupViewSection = function() {
		
		jQuery('.zoomIn_button').click(function() {
			pg.view.zoomBy(1.25);
		});
		
		jQuery('.zoomOut_button').click(function() {
			pg.view.zoomBy(1/1.25);
		});
		
		jQuery('.resetZoom_button').click(function() {
			pg.view.resetZoom();
		});
		
		jQuery('.resetPan_button').click(function() {
			pg.view.resetPan();
		});
		
	};
	
	
	var setupWindowSection = function() {
		
		jQuery('.scriptEditorButton').click(function() {
			pg.codeEditor.toggleVisibility();
		});
		
		jQuery('.layerPanelButton').click(function() {
			pg.layerPanel.toggleVisibility();
		});
	};
	
	var setupInfoSection = function() {
		
		jQuery('.aboutButton').click(function() {
			showAboutModal();
		});
		
	};

	
	var showMenu = function() {
		
	};
	
	
	var showContextMenu = function(event) {
		// check for selected items, so the right context menu can be opened
		if(paper.project.selectedItems.length > 0) {
			// create, append and position context menu for object context
			jQuery('body').append("<nav class='appNav' id='appNavContextMenu'></nav>");
			
			var $menu = jQuery('#objectSubMenu')
				.clone(true)
				.appendTo('#appNavContextMenu')
				.show()
				.slideDown(50);
			
			$menu.css({ 'position': 'absolute', 'top': event.pageY, 'left': event.pageX });
			
			jQuery('#menuInputBlocker').show();
			
		} else {
			//create context menu for document context
		}
	};
	
	
	var hideMenus = function() {
		$topMenuButton.removeClass('active');
		jQuery('#appNav .topMenu').removeClass('active');
		$subMenu.hide();
		hideContextMenu();
	};


	var hideContextMenu = function() {
		jQuery('body').off('click.contextMenu');
		jQuery('body>#appNavContextMenu').remove();
		$menuInputBlocker.hide();
	};
		
	
	var showAboutModal = function () {
		var html = '<h2 class="appTitle">Papergrapher</h2><span class="versionNumber">' + pg.settings.getVersionNumber() + '</span><p>A vector editor for your browser, based on <a href="http://paperjs.org/" target="_blank">Paper.js</a> and <a href="https://github.com/memononen/stylii" target="_blank">stylii</a>. Check it out on <a href="https://github.com/w00dn/papergrapher" target="_blank">GitHub</a>.</p><p>Developed by <a href="https://twitter.com/w00dn" target="_blank">Rolf Fleischmann</a><br>Published under the <a href="https://github.com/w00dn/papergrapher/blob/master/LICENSE" target="_blank">MIT License</a></p>';
		new pg.modal.floater('appInfoWindow', 'Info', html, 300, 100);
	};
	
	
	return {
		setup:setup,
		showContextMenu:showContextMenu,
		hideContextMenu:hideContextMenu,
		showAboutModal: showAboutModal
	};
	
}();

