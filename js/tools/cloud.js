// cloud tool
// adapted from the paperjs examples (Tools/Cloud.html)

pg.tools.cloud = function() {
	var tool;
	
	var options = {
		name: 'Cloud',
		type: 'toolbar',
		pointDistance: 30,
		randomizeDistance: false,
		randomDistMin: 15,
		randomDistMax: 40,
		closePath: 'near start'
	};
	
	var components = {
		pointDistance: {
			type: 'number',
			label: 'hideOnRandomize::Point distance',
			step: 1
		},
		randomizeDistance: {
			type: 'boolean',
			label: 'Randomize'
		},
		randomDistMin: {
			type: 'number',
			label: 'showOnRandomize::Random min',
			step: 1
		},
		randomDistMax: {
			type: 'number',
			label: 'showOnRandomize::Random max',
			step: 1
		},
		closePath: {
			type: 'list',
			label: 'Close path',
			options: [ 'near start', 'always', 'never' ]
		}
	};
	
	
	var activateTool = function() {
		var path;
		var startPos;
		
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		
		tool = new Tool();
		tool.fixedDistance = 20;

		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			startPos = event.point;
			path = new Path();
			path = pg.style.applyActiveToolbarStyle(path);
			path.strokeCap = 'round';
			path.strokeJoin = 'round';
			path.add(event.point);
		};

		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			if(options.randomizeDistance && Math.random() > 0.3) {
				options.pointDistance = 
				pg.math.getRandomInt(options.randomDistMin, options.randomDistMax);
			}
			path.arcTo(event.point);
		};

		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button

			//path.add(event.point);
			var checkDist = tool.fixedDistance + (tool.fixedDistance/10);
			if( options.closePath === 'near start' && 
				pg.math.checkPointsClose(startPos, event.point, checkDist)) {
				path.arcTo(path.segments[0].point);
				path.closePath(true);
				
			} else if(options.closePath === 'always') {
				path.arcTo(path.segments[0].point);
				path.closePath(true);
			}
			
			pg.undo.snapshot('cloud');
		};
		
		// palette stuff
		var palette = new Palette('Options', components, options);
		palette.onChange = function(component, name, value) {
			updateTool();
		};
		
		tool.activate();
	};
	

	var updateTool = function() {
		tool.fixedDistance = options.pointDistance;
		if(options.randomizeDistance === true) {
			$('.hideOnRandomize').hide();
			$('.showOnRandomize').show();
		} else {
			$('.hideOnRandomize').show();
			$('.showOnRandomize').hide();
		}
		
		// write the options to jStorage when a value changes
		pg.tools.setLocalOptions(options);
		
	};
	
	
	return {
		options: options,
		activateTool : activateTool,
		updateTool: updateTool
	};
};
