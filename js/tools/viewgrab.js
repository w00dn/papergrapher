// view pan tool
// adapted from http://sketch.paperjs.org/

pg.tools.viewGrab = function() {
	var tool;
	var lastPoint;
	
	var options = {
		name: 'ViewGrab',
		type: 'hidden'
	};
	
	var activateTool = function() {
		tool = new Tool();
		
		setCursor('grab');
		
		tool.onMouseDown = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			lastPoint = view.projectToView(event.point);
			setCursor('grabbing'); 
		};
		
		tool.onMouseDrag = function(event) {
			if(event.event.button > 0) return; // only first mouse button
			setCursor('grabbing'); 
			
			// In order to have coordinate changes not mess up the
			// dragging, we need to convert coordinates to view space,
			// and then back to project space after the view space has
			// changed.
			var point = view.projectToView(event.point);
			var  last = view.viewToProject(lastPoint);
			view.scrollBy(last.subtract(event.point));
			lastPoint = point;
		};
		
		tool.onMouseUp = function(event) {
			setCursor('grab');
		};
		
		var keyDownFired = false;
		tool.onKeyDown = function(event) {
			if(keyDownFired) return;
			keyDownFired = true;
			
			if (event.key === 'space') {
				setCursor('grab');
			}
		};
	
		tool.onKeyUp = function(event) {
			keyDownFired = false;
			
			if (event.key === 'space') {
				setCursor();
			}
		};
		
		tool.activate();
	
	};
	
	
	var setCursor = function(cursorString) {
		var body = $('body');
		body.removeClass('grab');
		body.removeClass('grabbing');
		
		if(cursorString && cursorString.length > 0) {
			body.addClass(cursorString);
		}
	};
	
	
	return {
		options:options,
		activateTool : activateTool
	};
};