// functions related to math

pg.math = function() {
	
	var checkPointsClose = function(startPos, eventPoint, threshold) {
		var xOff = Math.abs(startPos.x - eventPoint.x);
		var yOff = Math.abs(startPos.y - eventPoint.y);
		if(xOff < threshold && yOff < threshold) {
			return true;
		}
		return false;	
	};


	var getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	};
	
	
	var getRandomBoolean = function() {
		return getRandomInt(0,2) === 1 ? false : true;
	};
	
	
	// Thanks Mikko Mononen! https://github.com/memononen/stylii
	var snapDeltaToAngle = function(delta, snapAngle) {
		var angle = Math.atan2(delta.y, delta.x);
		angle = Math.round(angle/snapAngle) * snapAngle;
		var dirx = Math.cos(angle);
		var diry = Math.sin(angle);
		var d = dirx*delta.x + diry*delta.y;
		return new paper.Point(dirx*d, diry*d);
	};
	
	
	return {
		checkPointsClose:checkPointsClose,
		getRandomInt:getRandomInt,
		getRandomBoolean: getRandomBoolean,
		snapDeltaToAngle:snapDeltaToAngle
	};
	
}();

