// functions relating to modifying paths, segments and points

pg.geometry = function() {
	
	var switchHandle = function(seg, mode) {
		// simplest first, when we have a mode and its linear
		if (mode == 'linear') {
			seg.clearHandles();
			return;
		}

		// segment is linear or mode=smooth and has both neighbour segments
		if ((mode === 'smooth' || !seg.hasHandles()) && seg.next && seg.previous) {
			seg.clearHandles(); // reset to linear before smoothing

			// get angle between previous and next segment
			var cornerAngle = (
							(seg.previous.point - seg.point).angle -
							(seg.next.point - seg.point).angle
							);
			// convert angle to 360°-type angle for less brain hurt
			if (cornerAngle < 0) {
				cornerAngle += 360;
			}
			// calculate tangent angle of segment/corner
			var tangAngle = (180 - cornerAngle) * 0.5;

			// get shorter dist to neigbour points and max it with
			// 20 elefants, then use it to normalize the handleSize
			var nextDist = (seg.next.point - seg.point).length;
			var prevDist = (seg.previous.point - seg.point).length;
			var shorterDist = nextDist;
			if (nextDist > prevDist)
				shorterDist = prevDist;
			shorterDist *= 0.3;
			if (shorterDist > 20)
				shorterDist = 20;

			//create handle vector to next point and normalize it
			var offset = (seg.next.point - seg.point).normalize(shorterDist);

			// then rotate that handle vector by the tangentAngle
			var rotOffset = offset.rotate(-tangAngle, 0);

			// and apply the whole thing to the handles
			seg.handleOut = rotOffset;
			seg.handleIn = -rotOffset;


			// segment is linear or mode=smooth and has not both neighbours
		} else if (mode === 'smooth' || !seg.hasHandles()) {
			seg.clearHandles(); // reset to linear before smoothing

			// handle end points differently since they don't have
			// a corner to start from
			if (seg.next) {
				var handleDist = (seg.point - seg.next.point).length;
				handleDist *= 0.3;
				if (handleDist > 20)
					handleDist = 20;

				var vec = (seg.point - seg.next.point).normalize(handleDist);
				seg.handleIn = vec;
				seg.handleOut = -vec;

			} else if (seg.previous) {
				var handleDist = (seg.point - seg.previous.point).length;
				handleDist *= 0.3;
				if (handleDist > 20)
					handleDist = 20;

				var vec = (seg.point - seg.previous.point).normalize(handleDist);
				seg.handleIn = -vec;
				seg.handleOut = vec;
			}

		} else {
			seg.clearHandles();
		}
	};
	
	
	return {
		switchHandle: switchHandle
	};
	
}();