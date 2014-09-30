$(document).ready(function(){
	
	// MAP SECTION
	
	map = d3.select("#map");
	w = $(map.node()).width();
	h = $(map.node()).height();
	
	d3.json("js/min.pennsylvania.json", function(error, json) {
		// Join shapefile data
		county = d3.select("#map")
		.selectAll("path")
			.data(json.features)
		.enter().append("path")
			.attr("class", "county");
			
		// Detetct orientation of screen and scale map accordingly.
		var bounds = d3.geo.path().bounds(json);
		
		// Chooses a mercator projection, sticks it roughly in the center of the screen,
		// sets the center of Pennsylvania, scales it up based on bounds of map
		projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
		
		// Apply transformation
		county.attr("d", d3.geo.path().projection(projection));
	
	});

	// END MAP SECTION
	
	
	// In-state v. out-of-state pie chart
	// Change identifier on /candidates filter to change to a different candidate
	
	
		$.getJSON("api/states/candidates/2009216", function(json) {
			data = [];
			$.each(json.results, function(i, state){ 
				if( state.state == "PA" ) data[1] = { label: "In-state", data: state.amount};
				else if ( i == 0 ) data.push({ label: "Out of state", data: parseFloat(state.amount)}) 
				else data[0].data += parseFloat(state.amount);
			});
			console.log(data);
			$.plot('#pie', data, {
				series: {
					pie: {
						show: true
					}
				}
			});
		});
	
	
	
});