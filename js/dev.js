
jQuery(window).load(function() {
	
	//pg.dev.loadStats();

	setTimeout(function() {
		//var rectangle = new Rectangle(new Point(100, 180), new Point(250, 270));
		//var path = new Path.Rectangle(rectangle);
		//path.fillColor = 'black';
		//path.opacity = 0.4;
		//path.selected = true;
		//pg.undo.snapshot('addPath');
		/*
		jQuery.getJSON('/dev/rings.json', function(data) {
			pg.document.loadJSONDocument(data);
		});
		*/
		
	}, 500);
	
});


pg.dev = function() {
	
	var loadStats = function() {
		jQuery.getScript("js/lib/stats.min.js")
		.done(function () {
			var stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms

			// Align top-left
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.right = '0px';
			stats.domElement.style.top = '30px';

			document.body.appendChild( stats.domElement );

			setInterval( function () {

				stats.begin();

				// your code goes here

				stats.end();

			}, 1000 / 60 );
		});

	};
	
	return {
		loadStats: loadStats
	};
}();