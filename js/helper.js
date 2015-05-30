
pg.helper = function() {
	
	var selectedItemsToJSONString = function() {
		var selectedItems = pg.selection.getSelectedItems();
		if(selectedItems.length > 0) {
			var jsonComp = '[["Layer",{"applyMatrix":true,"children":[';
			for(var i=0; i < selectedItems.length; i++) {
				var itemJSON = selectedItems[i].exportJSON({asString: true});
				if(i+1 < selectedItems.length) {
					itemJSON += ',';
				}
				jsonComp += itemJSON;
			}
			return jsonComp += ']}]]';
		} else {
			return null;
		}
	};
	
	
	var checkFileType = function(file, fType) {
		var ext = getFileExtension(file);
		if(fType === 'Image') {
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'png':
				//etc
				console.log('Image',file);
				return true;
			}
			
		} else if(fType === 'SVG') {
			switch (ext.toLowerCase()) {
			case 'svg':
				console.log('SVG',file);
				return true;
			}
			
		} else if(fType === 'JSON') {
			switch (ext.toLowerCase()) {
			case 'json':
				console.log('JSON',file);
				return true;
			}
			
		}
		alert('File type "'+ext+'" not supported.');
		return false;
	};
	
	
	var getFileExtension = function(filename) {
		var parts = filename.split('.');
		return parts[parts.length - 1];
	};
	
	
	// svg imported items need applyMatrix = true or strange stuff will happen
	// when transforming them with the tools
	var applyMatrixToItems = function(items) {
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			item.applyMatrix = true;
			if(pg.group.isGroup(item) || pg.layer.isLayer(item)) {
				if(item.children && item.children.length > 0) {
					applyMatrixToItems(item.children);
				}
			}
		}
	};
	
	
	// i have no idea what i'm doing, but here we go...
	var switchHandle = function(seg, mode) {
		
		// simplest first, when we have a mode and its linear
		if(mode === 'linear') {
			console.log('setLinear');
			seg.linear = true;
			return;
		}
		
		// segment is linear or mode=smooth and has both neighbour segments
		if((mode === 'smooth' || seg.linear) && seg.next && seg.previous) {
			seg.linear = true; // reset to linear before smoothing
			
			// get angle between previous and next segment
			var cornerAngle = (
				(seg.previous.point - seg.point).angle - 
				(seg.next.point - seg.point).angle
			);
			// convert angle to 360°-type angle for less brain hurt
			if(cornerAngle < 0) {
				cornerAngle += 360;
			}
			// calculate tangent angle of segment/corner
			var tangAngle = (180-cornerAngle)*0.5;

			// get shorter dist to neigbour points and max it with
			// 20 elefants, then use it to normalize the handleSize
			var nextDist = (seg.next.point - seg.point).length;
			var prevDist = (seg.previous.point - seg.point).length;
			var shorterDist = nextDist;
			if(nextDist > prevDist) shorterDist = prevDist;
			shorterDist *= 0.3;
			if(shorterDist > 20) shorterDist = 20;

			//create handle vector to next point and normalize it
			var offset = (seg.next.point - seg.point).normalize(shorterDist);

			// then rotate that handle vector by the tangentAngle
			var rotOffset = offset.rotate(-tangAngle, 0);

			// and apply the whole thing to the handles
			seg.handleOut = rotOffset;
			seg.handleIn = -rotOffset;

			// can't believe this worked...
		
		
		// segment is linear or mode=smooth and has not both neighbours
		} else if(mode === 'smooth' || seg.linear) {
			seg.linear = true; // reset to linear before smoothing
			
			// handle end points differently since they don't have
			// a corner to start from
			if(seg.next) {
				var handleDist = (seg.point - seg.next.point).length;
				handleDist *= 0.3;
				if(handleDist > 20) handleDist = 20;

				var vec = (seg.point - seg.next.point).normalize(handleDist);
				seg.handleIn = vec;
				seg.handleOut = -vec;

			} else if(seg.previous) {
				var handleDist = (seg.point - seg.previous.point).length;
				handleDist *= 0.3;
				if(handleDist > 20) handleDist = 20;

				var vec = (seg.point - seg.previous.point).normalize(handleDist);
				seg.handleIn = -vec;
				seg.handleOut = vec;
			}

		} else {
			// i wish everything would be this easy
			seg.linear = true;
		}

	};
	
	
	return {
		selectedItemsToJSONString: selectedItemsToJSONString,
		checkFileType: checkFileType,
		applyMatrixToItems: applyMatrixToItems,
		switchHandle: switchHandle
	};
	
}();