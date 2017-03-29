
pg.layer = function() {
	
	var layerNames = ['coasts','sisters','buttons','spaces','teeth','arguments','clubs','thrills','vegetables','sausages','locks','kicks','insects','cars','trays','clams','legs','humor','levels','jelly','competition','cubs','quivers','flags','pins','floors','suits','actors','queens','appliances','dogs','plates','donkeys','coughing','tops','covers','dads','breath','sacks','thumbs','impulse','linens','industry','cobwebs','babies','volcanoes','beef','values','reason','birds','rays','stages','wrenches','uncles','water','bits','knees','jails','jellyfish','treatment','scissors','cars','vacation','lips','ovens','language','money','soup','knowledge','eggs','sponges','basins','coats','chalk','scarfs','letters','rooms','horses','touch','carpentry','honey','effects','flight','debt','boards','advice','brakes','fish','camps','the north','trains','balance','wounds','routes','guitars','receipts','cracks','sex','chance','looks','windows','girls','partners','stars','yam','smashing','existence','keys','flowers','talk','sons','wood','fuel','cakes','wealth','sofas','homes','desks','screws','bells','ears','juice','dogs','force','crooks','attraction','knots','lumber','activity','moons','creators','apparel','iron','crayons','tanks','twigs','condition','songs','snails','driving','cheese','rails','rings','shows','vans','love','moms','schools','pets','dust','experience','cellars','questions','rolls','power','scale','connection','grades','magic','maids','ships','leather','exchange','pigs','sticks','rhythm','distribution','harmony','dinosaurs','towns','rings','cribs','toes','heat','buckets','cables','books','drinks','grass','aunts','turkey','laborer','oil','discussion','drawers','oceans','machines','loafs','curtains','hours','taste','shaking','protest','needles','quicksand','battle','distance','bombs','hairs','smell'];
	
	var setup = function() {
		var defaultLayer = addNewLayer('Default layer');
		defaultLayer.data.isDefaultLayer = true;
		
		var guideLayer = addNewLayer('pg.internalGuideLayer');
		guideLayer.data.isGuideLayer = true;
		guideLayer.bringToFront();
		
		defaultLayer.activate();
		pg.layerPanel.updateLayerList();
	};

	
	var isLayer = function(item) {
		return item.className === "Layer";
	};
	
	
	var isActiveLayer = function(layer) {
		return paper.project.activeLayer == layer;
	};
	
	
	var addNewLayer = function(layerName, setActive, elementsToAdd) {
		layerName = layerName || null;
		setActive = setActive || true;
		elementsToAdd = elementsToAdd || null;
		
		var newLayer = new paper.Layer();
		
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
		defaultLayer.activate();
	};
	
	
	var addItemsToLayer = function(items, layer) {
		layer.addChildren(items);
	};
	
	
	var getLayerByID = function(id) {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.id == id) {
				return layer;
			}
		}
	};
	
	
	var getDefaultLayer = function() {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data && layer.data.isDefaultLayer) {
				return layer;
			}
		}
	};
	
	
	var getGuideLayer = function() {
		for(var i=0; i<paper.project.layers.length; i++) {
			var layer = paper.project.layers[i];
			if(layer.data && layer.data.isGuideLayer) {
				return layer;
			}
		}
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
		guideLayer.bringToFront();
	};
	
	
	var deselectAllLayers = function() {
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
		addNewLayer: addNewLayer,
		deleteLayer: deleteLayer,
		addItemsToLayer: addItemsToLayer,
		getLayerByID: getLayerByID,
		getDefaultLayer: getDefaultLayer,
		getGuideLayer: getGuideLayer,
		getAllUserLayers: getAllUserLayers,
		changeLayerOrderByIDArray: changeLayerOrderByIDArray,
		deselectAllLayers: deselectAllLayers
	};

}();