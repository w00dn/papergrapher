
pg.layer = function() {
	
	var layerNames = ['coasts','sisters','buttons','spaces','teeth','arguments','clubs','thrills','vegetables','sausages','locks','kicks','insects','cars','trays','clams','legs','humor','levels','jelly','competition','cubs','quivers','flags','pins','floors','suits','actors','queens','appliances','dogs','plates','donkeys','coughing','tops','covers','dads','breath','sacks','thumbs','impulse','linens','industry','cobwebs','babies','volcanoes','beef','values','reason','birds','rays','stages','wrenches','uncles','water','bits','knees','jails','jellyfish','treatment','scissors','cars','vacation','lips','ovens','language','money','soup','knowledge','eggs','sponges','basins','coats','chalk','scarfs','letters','rooms','horses','touch','carpentry','honey','effects','flight','debt','boards','advice','brakes','fish','camps','the north','trains','balance','wounds','routes','guitars','receipts','cracks','sex','chance','looks','windows','girls','partners','stars','yam','smashing','existence','keys','flowers','talk','sons','wood','fuel','cakes','wealth','sofas','homes','desks','screws','bells','ears','juice','dogs','force','crooks','attraction','knots','lumber','activity','moons','creators','apparel','iron','crayons','tanks','twigs','condition','songs','snails','driving','cheese','rails','rings','shows','vans','love','moms','schools','pets','dust','experience','cellars','questions','rolls','power','scale','connection','grades','magic','maids','ships','leather','exchange','pigs','sticks','rhythm','distribution','harmony','dinosaurs','towns','rings','cribs','toes','heat','buckets','cables','books','drinks','grass','aunts','turkey','laborer','oil','discussion','drawers','oceans','machines','loafs','curtains','hours','taste','shaking','protest','needles','quicksand','battle','distance','bombs','hairs','smell'];
	
	var setup = function() {
		var defaultLayer = addNewLayer('Default layer');
		defaultLayer.data.isDefaultLayer = true;
		defaultLayer.data.id = getUniqueLayerID();
		
		ensureGuideLayer();
		
		defaultLayer.activate();
		pg.layerPanel.updateLayerList();
	};
	
	
	var isLayer = function(item) {
		return item.className === "Layer";
	};
	
	
	var isActiveLayer = function(layer) {
		return paper.project.activeLayer.data.id == layer.data.id;
	};
	
	
	var getUniqueLayerID = function() {
		var biggestID = 0;
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data.id > biggestID) {
				biggestID = layer.data.id;
			}
		}
		return biggestID + 1;
	};
		
	
	var ensureGuideLayer = function() {
		if(!getGuideLayer()) {
			var guideLayer = addNewLayer('pg.internalGuideLayer');
			guideLayer.data.isGuideLayer = true;
			guideLayer.data.id = getUniqueLayerID();
			guideLayer.bringToFront();
		}
	};
	
	
	var addNewLayer = function(layerName, setActive, elementsToAdd) {
		layerName = layerName || null;
		setActive = setActive || true;
		elementsToAdd = elementsToAdd || null;
		
		var newLayer = new paper.Layer();
		
		newLayer.data.id = getUniqueLayerID();
		
		if(layerName) {
			newLayer.name = layerName;
		} else {
			newLayer.name = 'Layer of '+layerNames[Math.floor(Math.random()*layerNames.length)];
		}
		
		if(setActive) {
			newLayer.activate();
		}
		
		if(elementsToAdd) {
			newLayer.addChildren(elementsToAdd);
		}
		
		var guideLayer = getGuideLayer();
		if(guideLayer) {
			guideLayer.bringToFront();
		}
		return newLayer;
	};
	
	
	var deleteLayer = function(id) {
		var layer = getLayerByID(id);
		if(layer) {
			layer.remove();
		}
		var defaultLayer = getDefaultLayer();
		if(defaultLayer) {
			defaultLayer.activate();
		}
	};

	
	var addItemsToLayer = function(items, layer) {
		layer.addChildren(items);
	};
	
	
	var addSelectedItemsToActiveLayer = function() {
		addItemsToLayer(pg.selection.getSelectedItems(), paper.project.activeLayer);
	};
	
	
	var getActiveLayer = function() {
		return paper.project.activeLayer;
	};
	
	
	var setActiveLayer = function(activeLayer) {
		activeLayer.activate();
	}
	
	
	var getLayerByID = function(id) {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data.id == id) {
				return layer;
			}
		}
		return false;
	};

	
	var getDefaultLayer = function() {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data && layer.data.isDefaultLayer) {
				return layer;
			}
		}
		return false;
	};
		
	
	var activateDefaultLayer = function() {
		var defaultLayer = getDefaultLayer();
		defaultLayer.activate();
	};
	
	
	var getGuideLayer = function() {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data && layer.data.isGuideLayer) {
				return layer;
			}
		}
		return false;
	};
	
	
	var getAllUserLayers = function() {
		var layers = [];
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data && layer.data.isGuideLayer) {
				continue;
			}
			layers.push(layer);
		}
		return layers;
	};
	
	
	var changeLayerOrderByIDArray = function(order) {
		order.reverse();
		for(var i=0; i<order.length; i++) {
			getLayerByID(order[i]).bringToFront();
		}
		// guide layer is always top
		var guideLayer = getGuideLayer();
		if(guideLayer) {
			guideLayer.bringToFront();
		}
	};
	
	
	var processLayersAfterUndo = function(activeLayerID) {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data.id == activeLayerID) {
				pg.layer.setActiveLayer(layer);
				break;
			}
		}
		
		pg.layerPanel.updateLayerList();
		
		var selectedItems = pg.selection.getSelectedItems();
		// first deselect layer
		for(var i=0; i<selectedItems.length; i++) {
			var item = selectedItems[i];
			if(isLayer(item)) {
				item.selected = false;
				//pg.selection.setItemSelection(item, false);
			}
		}
		// then select items again
		for(var i=0; i<selectedItems.length; i++) {
			var item = selectedItems[i];
			if(!isLayer(item)) {
				pg.selection.setItemSelection(item, true);
			}
		}
	};

	
	return {
		setup: setup,
		isLayer: isLayer,
		isActiveLayer: isActiveLayer,
		ensureGuideLayer: ensureGuideLayer,
		addNewLayer: addNewLayer,
		deleteLayer: deleteLayer,
		addItemsToLayer: addItemsToLayer,
		addSelectedItemsToActiveLayer: addSelectedItemsToActiveLayer,
		getActiveLayer: getActiveLayer,
		setActiveLayer: setActiveLayer,
		getLayerByID: getLayerByID,
		getDefaultLayer: getDefaultLayer,
		activateDefaultLayer: activateDefaultLayer,
		getGuideLayer: getGuideLayer,
		getAllUserLayers: getAllUserLayers,
		changeLayerOrderByIDArray: changeLayerOrderByIDArray,
		processLayersAfterUndo: processLayersAfterUndo
	};

}();