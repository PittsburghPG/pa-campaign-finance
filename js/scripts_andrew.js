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
			$.plot('#pie', data, {
				series: {
					pie: {
						show: true
					}
				}
			});
		});
	
	// END in-state v. out-of-state
	
	// Start time series 
	function makeTimeChart(id, filerid, startDate, endDate){
		$.getJSON("api/months/candidates/" + filerid + "?startDate=" + startDate + "&endDate=" + endDate, function(json){
			
			data = [];
			$.each(json.results, function(i, date){
				data.push( [Date.parse(date["year"] + "-" + date["month"] + "-" + "01"), date["total"]] );
				
				
				$.plot("#" + id, [{ 
					data: data, 
					color:"seagreen"
					
					
				}], {
					series: {
						lines:{
							lineWidth: 6
						}
					},
					xaxis: { 
						mode: "time",
						min: data[0][0]	
					},
					yaxis: {
						tickFormatter: function(val, axis){
							return "$" + numberWithCommas(val);
						}
					},
					grid: {
						borderWidth: {
							top: 0,
							left: 1,
							right: 0,
							bottom: 1
						},
						hoverable: true
					},
					markings:0
				});
				
				$("#" + id).bind("plothover", function(event, pos, item){
					
					if( item ) {
						if( $("#tooltip").length == 0 ){
							$("<div id='tooltip'></div>").appendTo( $("body") )
								.css({top: item.pageY+5, left: item.pageX+5});
							$("#tooltip").html(toDollar(item.datapoint[1]));
						}
						else {
							console.log(toDollar(item.datapoint[1]));
							$("#tooltip").css({top: item.pageY-20, left: item.pageX+10});
						}
						x = item.datapoint[0].toFixed(2);
						y = item.datapoint[1].toFixed(2);
						
					}
						else $("#tooltip").remove();
					
					
				});
				
				
				
			});
			
		
		});
	}
		
	// end time series
	
	
	makeTimeChart("timechart", 20130153, "2014-01-01", "2014-09-01");
	
});

function toDollar(x){
	return "$" + numberWithCommas( Math.floor(x * 100) / 100 );
}

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}