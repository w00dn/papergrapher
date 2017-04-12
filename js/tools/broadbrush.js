// cool brush from
// http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
// improved with additional options

pg.tools.registerTool({
	id: 'broadbrush',
	name: 'Broad brush'
});

pg.tools.broadbrush = function() {
	var tool;
	var path;

	var options = {
		pointDistance: 20,
		brushWidth: 60,
		strokeEnds: 6,
		endLength: 7,
		endVariation: 2,
		endType: 'slime'
	};
	
	var components = {
		pointDistance: {
			type: 'int',
			label: 'Point distance',
			min: 1
		},
		brushWidth: {
			type: 'float',
			label: 'Brush width',
			min: 0
		},
		strokeEnds: {
			type: 'int',
			label: 'Stroke ends',
			min: 0
		},
		endLength: {
			type: 'float',
			label: 'Ends length',
			min: 0
		},
		endVariation: {
			type: 'float',
			label: 'Ends variation',
			min: 0
		},
		endType: {
			type: 'list',
			label: 'Ends',
			options: [ 'linear', 'smooth', 'slime' ]
		}
	};
	
	
	var activateTool = function() {
		
		// get options from local storage if present
		options = pg.tools.getLocalOptions(options);
		tool = new Tool();

		tool.fixedDistance = options.pointDistance;
		
		var lastPoint;
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			path = new Path();
			path = pg.stylebar.applyActiveToolbarStyle(path);
		};
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			// If this is the first drag event,
			// add the strokes at the start:
			if(event.count == 0) {
				addStrokes(event.middlePoint, event.delta * -1);
			} else {
				var step = (event.delta).normalize(options.brushWidth/2);
				step.angle += 90;

				var top = event.middlePoint + step;
				var bottom = event.middlePoint - step;

				path.add(top);
				path.insert(0, bottom);
			}

			lastPoint = event.middlePoint;
		};
		
		tool.onMouseUp = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var delta = event.point - lastPoint;
			delta.length = tool.maxDistance;
			addStrokes(event.point, delta);
			path.closed = true;
			path.smooth();
			
			// postprocessing the stroke end segments
			if(options.endType !== 'smooth') {
				for(var i=0; i<path.segments.length; i++) {
					var seg = path.segments[i];
					for(var j=0; j<strokeIndices.length; j++) {
						var ind = strokeIndices[j];
						if(ind.index === seg.index) {
							if(options.endType === 'slime') {
								pg.geometry.switchHandle(seg, 'smooth');
								
							} else if(options.endType === 'linear') {
								pg.geometry.switchHandle(seg, 'linear');
							}
						}
					}
				}
			}
			// resettin
			strokeIndices = [];
			
			pg.undo.snapshot('broadbrush');

		};
		
		// setup floating tool options panel in the editor
		pg.toolOptionPanel.setup(options, components, function() {
			tool.fixedDistance = options.pointDistance;
		});
		
		tool.activate();
	};
	
	var strokeIndices = [];
	
	var addStrokes = function(point, delta) {
		var step = delta.normalize(options.brushWidth).rotate(90);
		var strokePoints = options.strokeEnds > 0 ? options.strokeEnds * 2 + 1 : 2;
		point -= step / 2;
		step /= strokePoints - 1;
		for(var i = 0; i < strokePoints; i++) {
			var strokePoint = point + step * i;
			var offset;
			if(options.endVariation > 0) {
				offset = delta.normalize(options.endLength) * (Math.random() * options.endVariation + 0.1);
			} else {
				offset = delta.normalize(options.endLength);
			}
			if(i % 2) {
				offset *= -1;
			}
			strokePoint += offset;
			path.insert(0, strokePoint);
			
			// collect segment indices for post processing
			if(options.endType === 'slime' || options.endType === 'linear') {
				strokeIndices.push(path.firstSegment);
			}
		}
	};
	
	
	return {
		options: options,
		activateTool : activateTool
	};
	
};