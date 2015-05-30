// simple draw tool
// adapted from resources on http://paperjs.org

pg.tools.draw = function() {
	var tool;
	
	var options = {
		name: 'Draw',
		type: 'toolbar',
		pointDistance: 20,
		drawParallelLines: false,
		lines: 1,
		lineDistance: 10,
		closePath: 'near start',
		smoothPath : true
	};
	
	var components = {
		pointDistance: {
			type: 'number',
			label: 'Point distance',
			step: 1
		},
		drawParallelLines: {
			type: 'boolean',
			label: 'Draw parallel lines'
		},
		lines: {
			type: 'number',
			label: 'showOnDrawParallelLines::Lines',
			step: 1
		},
		lineDistance: {
			type: 'number',
			label: 'showOnDrawParallelLines::Line distance',
			step: 1
		},
		closePath: {
			type: 'list',
			label: 'Close path',
			options: [ 'near start', 'always', 'never' ]
		},
		smoothPath: {
			type: 'boolean',
			label: 'Smooth path'
		}
	};

	var activateTool = function() {
		var paths = [];
		
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		
		tool = new Tool();

		tool.fixedDistance = options.pointDistance;

		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			for( var i=0; i < options.lines; i++) {
				var path = paths[i];
				path = new Path();
				
				path = pg.style.applyActiveToolbarStyle(path);
				
				paths.push(path);
			}
		};

		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var offset = event.delta;
			offset.angle += 90;
			for( var i=0; i < options.lines; i++) {
				var path = paths[i];
				offset.length = options.lineDistance * i;
				path.add(event.middlePoint + offset);
			}
		};

		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			//
			// accidental clicks produce a path but no segments
			// so return if an accidental click happened
			if(paths[0].segments.length === 0) return;
			
			var group;
			if(options.lines > 1) {
				group = new Group();
			}
			
			var nearStart = pg.math.checkPointsClose(paths[0].firstSegment.point, event.point, 30);
			for( var i=0; i < options.lines; i++) {
				var path = paths[i];
				
				if(options.closePath === 'near start' && nearStart) {
					path.closePath(true);
				} else if(options.closePath === 'always') {
					path.closePath(true);
				}
				if(options.smoothPath) path.smooth();
				
				if(options.lines > 1) {
					group.addChild(path);
				}
			}
			
			paths = [];
			pg.undo.snapshot('draw');
			
		};
		
		var palette = new Palette('Options', components, options);
		palette.onChange = function(component, name, value) {
			updateTool();
			
		};
		
		tool.activate();
		
	};

	var updateTool = function() {
		tool.fixedDistance = options.pointDistance;
		
		if(options.drawParallelLines === true) {
			$('.showOnDrawParallelLines').show();
		} else {
			// reset parallel lines to 1
			options.lines = 1;
			$('.showOnDrawParallelLines').hide();
		}
		
		// write the options to jStorage when a value changes
		pg.tools.setLocalOptions(options);
	};


	return {
		options: options,
		activateTool:activateTool,
		updateTool: updateTool
	};

};
