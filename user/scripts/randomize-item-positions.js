var items = pg.selection.getSelectedItems();

for(var i=0; i<items.length; i++) {
	items[i].position = new paper.Point(pg.math.getRandomInt(-400, 400), pg.math.getRandomInt(-400, 400));
}