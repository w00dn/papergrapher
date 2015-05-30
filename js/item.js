

pg.item = function() {
	
	var isBoundsItem = function(item) {
		if( item.className === 'PointText' || 
			item.className === 'Shape' ||
			item.className === 'PlacedSymbol' ||
			item.className === 'Raster') {
			return true;
			
		} else {
			return false;
		}
	};
	
	
	var isPathItem = function(item) {
		return item.className === 'Path';
	};
	
	
	var isCompoundPathItem = function(item) {
		return item.className === 'CompoundPath';
	};
	
	
	var isPointTextItem = function(item) {
		return item.className === 'PointText';
	};
	
	
	var setPivot = function(item, point) {
		if(isBoundsItem(item)) {
			item.pivot = item.globalToLocal(point);
		} else {
			item.pivot = point;
		}
	};
	
	
	var getPositionInView = function(item) {
		var itemPos = new paper.Point();
		itemPos.x = item.position.x - paper.view.bounds.x;
		itemPos.y = item.position.y - paper.view.bounds.y;
		return itemPos;
	};
	
	
	var setPositionInView = function(item, pos) {
		item.position.x = paper.view.bounds.x + pos.x;
		item.position.y = paper.view.bounds.y + pos.y;
	};
	
	
	return {
		isBoundsItem: isBoundsItem,
		isPathItem: isPathItem,
		isCompoundPathItem: isCompoundPathItem,
		isPointTextItem: isPointTextItem,
		setPivot: setPivot,
		getPositionInView: getPositionInView,
		setPositionInView: setPositionInView
	};
}();