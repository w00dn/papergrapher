// undo functionality
// slightly modifed from https://github.com/memononen/stylii

pg.undo = function() {
	var states = [];
	var head = -1;
	var maxUndos = 80;
	
	var setup = function() {
		pg.undo.snapshot('init');
	};
	
	var snapshot = function(type) {
		var state = {
			type : type, 
			json : paper.project.exportJSON({ asString: false})
		};
		
		// remove all states after the current head
		if(head < states.length-1) {
			states = states.slice(0, head+1);
		}
		
		// add the new states
		states.push(state);
		
		// limit states to maxUndos by shifing states (kills first state)
		if(states.length > maxUndos) {
			states.shift();
		}
		
		// set the head to the states length
		head = states.length-1;
		
	};
	
	
	var undo = function() {
		if(head > 0) {
			head--;
			restore(states[head]);
		}
	};
	
	
	var redo = function() {
		if(head < states.length-1) {
			head++;
			restore(states[head]);
		}
	};
	
	
	var removeLastState = function() {
		states.splice(-1, 1);
	};
	
	
	var restore = function(entry) {
		paper.project.clear();
		paper.project.importJSON(entry.json);
		pg.layer.deselectAllLayers();
		paper.view.update();
	};
	
	
	var clear = function() {
		states = [];
		head = -1;
	};
	
	
	var getStates = function() {
		return states;
	};
	
	
	var getHead = function() {
		return head;
	};
	
	
	return {
		setup: setup,
		snapshot: snapshot,
		undo: undo,
		redo: redo,
		removeLastState: removeLastState,
		clear: clear,
		getStates: getStates,
		getHead: getHead
	};
}();