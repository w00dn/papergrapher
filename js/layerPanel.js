pg.layerPanel = function() {
		
	var toggleVisibility = function() {
		var $panel = jQuery('.layerPanel');
		if(!$panel || $panel.length <= 0) {
			setup();
			
		} else {
			if($panel.hasClass('hidden')) {
				$panel.removeClass('hidden');
			} else {
				$panel.addClass('hidden');
			}
		}
	};
	
	
	var setup = function() {
		loadResources();
		
		var $panel = jQuery('<div class="layerPanel">');
		var baseTopOffset = jQuery('.appNav').height()+jQuery('.settingsBarContainer').height();
		$panel.css({
			'top': baseTopOffset+'px',
			'max-height': jQuery(window).height()-baseTopOffset+'px' 
		});
		var $header = jQuery('<header class="layerPanelHeader"><h2>Layers</h2></header>');
		var $newLayerButton = jQuery('<button class="newLayerButton">Add</button>');
		
		$newLayerButton.click(function() {
			var newLayer = pg.layer.addNewLayer();
			newLayer.activate();
			updateLayerList();
		});
		
		$header.append($newLayerButton);

		var $layerEntries = jQuery('<div class="layerEntries">');
		$layerEntries.sortable({
			containment: 'parent',
			forcePlaceholderSize: true,
			tolerance: 'pointer',
			delay: 300,
			stop: function(event, ui) {
				handleLayerOrderChange();
			}
		});
		
		$panel.append($header,$layerEntries);
		jQuery('body').append($panel);
		
		$layerEntries.css({
			'max-height': jQuery('body').height() - baseTopOffset - $header.height()+'px'
		});
		
		jQuery.each(paper.project.layers, function(index, layer) {
			setupLayerEntry(layer);
		});
		
		updateLayerValues();
		
		jQuery(document).on('LayerAdded LayerRemoved', function() {
			updateLayerList();
		});
		
		jQuery(document).on('DocumentUpdate', function(){
			updateLayerValues();
		});
	};
	
	
	var setupLayerEntry = function(layer) {
		if(!(layer.data && layer.data.isGuideLayer)) {
			var $activeClass = '';
			if(pg.layer.isActiveLayer(layer)) {
				$activeClass= ' active';
			}
			var $layerEntry = jQuery('<ul class="layerEntry'+$activeClass+'" data-id="'+layer.id+'">');
			var $layerVisSection = jQuery('<li class="layerVisSection">');
			var $layerVisButton = jQuery('<input type="checkbox" class="layerVisibilityToggle" title="Layer visibility">').attr('checked', layer.visible);
			var $layerNameSection = jQuery('<li class="layerName" title="">');
			var $layerNameInput = jQuery('<input type="text">').val(layer.name);
			var $layerActionSection = jQuery('<li class="layerActions">');
			var $layerDeleteButton = jQuery('<button class="layerDeleteButton" data-id="'+layer.id+'" title="Delete layer">&times;</button>');
			var $layerInfo = jQuery('<li class="layerInfo" title="Selected 0/0 Total">i</li>');
			var $layerSelectSection = jQuery('<li class="layerSelectSection">');
			var $layerSelectButton = jQuery('<input type="radio" class="layerSelectToggle" title="Select all/none">');
			
			$layerEntry.click(function() {
				jQuery('.layerEntry').removeClass('active');
				layer.activate();
				jQuery(this).addClass('active');
			});
			
			$layerVisButton.click(function() {
				layer.visible = !layer.visible;
			});
			
			if(layer.id < 2) {
				$layerNameInput.attr('disabled', true);
			}
			
			$layerNameInput.on('change', function() {
				layer.name = jQuery(this).val();
			});
			
			$layerDeleteButton.click(function() {
				if(confirm('Delete this layer and all its children?')) {
					pg.layer.deleteLayer(jQuery(this).attr('data-id'));
					updateLayerList();
				};
			});

			$layerSelectButton.click(function() {
				if(jQuery(this).attr('checked')) {
					pg.selection.clearSelection();
					jQuery(this).removeAttr('checked');

				} else {
					pg.selection.clearSelection();

					var items = pg.helper.getPaperItemsByLayerID(layer.id);
					jQuery.each(items, function(index, item) {
						pg.selection.setItemSelection(item, true);
					});
					jQuery(this).attr('checked', items.length >0);
				}
			});

			$layerVisSection.append($layerVisButton);
			$layerNameSection.append($layerNameInput);
			if(layer.id > 1) {
				$layerActionSection.append($layerDeleteButton);
			}
			$layerSelectSection.append($layerSelectButton);
			$layerEntry.append($layerVisSection, $layerNameSection, $layerActionSection, $layerInfo, $layerSelectSection);
			jQuery('.layerEntries').prepend($layerEntry);
		}
	};
	
	
	var handleLayerOrderChange = function() {
		var order = [];
		jQuery('.layerEntries').children().each(function() {
			order.push(jQuery(this).attr('data-id'));
		});
		pg.layer.changeLayerOrderByIDArray(order);
	};
	
	
	var updateLayerList = function() {
		jQuery('.layerEntries').empty();
		jQuery.each(paper.project.layers, function(index, layer) {
			setupLayerEntry(layer);
		});
		
	};
	
	var updateLayerValues = function() {
		jQuery('.layerEntry').each(function() {
			var id = parseInt(jQuery(this).attr('data-id'));
			var layer = pg.layer.getLayerByID(id);
			if(layer) {
				
				var selectedItems = 0;
				jQuery.each(layer.children, function(index, child) {
					if(child.selected || child.fullySelected) {
						selectedItems++;
					}
				});

				var $entry = jQuery(this);
				$entry.find('.layerInfo').attr('title','Selected '+selectedItems+'/'+layer.children.length+' Total');

				if(layer.children.length > 0 && selectedItems == layer.children.length) {
					$entry.find('.layerSelectToggle').prop('checked', true);
				} else {
					$entry.find('.layerSelectToggle').prop('checked', false);
				}
			}
		});
	};
	
	
	var loadResources = function() {
		if(!jQuery('#layerPanelCSS').exists()) {
			jQuery("<link />", {
				href: "css/layerPanel.css",
				rel: "stylesheet",
				id: "layerPanelCSS"
			}).appendTo("head", function() {
				return true;
			});
		};
	};

	
	return {
		toggleVisibility:toggleVisibility,
		updateLayerList:updateLayerList
	};
	
}();