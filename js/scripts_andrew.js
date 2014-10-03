$(document).ready(function(){
	
	// MAP SECTION
	
	drawCandidateMap( "map", "Berks" );
	
function drawLocatorMap( id, county ){
	map = d3.select("#" + id);
	w = $(map.node()).width();
	h = $(map.node()).height();
	
			d3.json("js/min.pennsylvania.json", function(error, json) {
				// Join shapefile data
				county = d3.select("#map")
				.selectAll("path")
					.data(json.features)
				.enter().append("path")
					.attr("class", function(d){
						var output = "county";
						if(d.properties.NAME == county) output += " selected";
						return output;
					})
					.on("mousemove", function(d){
						d3.select("#tooltip").remove();
						d3.select("body").append("div")
							.attr("id", "tooltip")
							.attr("class", "table")
							.html("<h4>" + d.properties.NAME + "</h4>")
							.style("left", d3.event.clientX + 10 + "px")
							.style("top", d3.event.clientY - 20 + "px");
						console.log(d3.event.clientX);
					})
					.on("mouseout", function(d){
						d3.select("#tooltip").remove();
					})
					.on("click", function(d){
						window.location = "/a/counties/" + d.properties.NAME;
					});
					
				// Detetct orientation of screen and scale map accordingly.
				var bounds = d3.geo.path().bounds(json);
				
				// Chooses a mercator projection, sticks it roughly in the center of the screen,
				// sets the center of Pennsylvania, scales it up based on bounds of map
				projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
				
				// Apply transformation
				county.attr("d", d3.geo.path().projection(projection));
			});
}
	
	
	function drawCandidateMap( id ){
		map = d3.select("#" + id);
		w = $(map.node()).width();
		h = $(map.node()).height();
		
		var counties = [];
			$.getJSON("api/counties", function(countiesJSON){
				$.each(countiesJSON.results, function(i, county){
					county.beneficiaries.sort(function(a,b){
						return +b.amount - +a.amount;
					});
					counties[county.county] = { county: county.county, winner: county.beneficiaries[0].party, candidates: county.beneficiaries };
				});
				d3.json("js/min.pennsylvania.json", function(error, json) {
					// Join shapefile data
					county = d3.select("#map")
					.selectAll("path")
						.data(json.features)
					.enter().append("path")
						.attr("class", function(d){
							var output = "county";
							if(counties[d.properties.NAME]){
								output += " " + counties[d.properties.NAME].winner;
							}
							return output;
						})
						.on("mousemove", function(d){
							d3.select("#tooltip").remove();
							d3.select("body").append("div")
								.attr("id", "tooltip")
								.attr("class", "table")
								.html(function(){
									output = "<h4>" + d.properties.NAME + "</h4><table><tbody>";
									if( counties[d.properties.NAME] ){
										$.each(	counties[d.properties.NAME].candidates, function(i, candidate){
											output += "<tr><td>" + candidate.name + "</td><td><strong>" + toDollars(candidate.amount) + "</td></tr>";
										});
									}
									return output + "</tbody></table>";
								})
								.style("left", d3.event.clientX + 10 + "px")
								.style("top", d3.event.clientY - 20 + "px");
							console.log(d3.event.clientX);
						})
						.on("mouseout", function(d){
							d3.select("#tooltip").remove();
						})
						.on("click", function(d){
							
							window.location = "/a/counties/" + d.properties.NAME;
						});
						
					// Detetct orientation of screen and scale map accordingly.
					var bounds = d3.geo.path().bounds(json);
					
					// Chooses a mercator projection, sticks it roughly in the center of the screen,
					// sets the center of Pennsylvania, scales it up based on bounds of map
					projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
					
					// Apply transformation
					county.attr("d", d3.geo.path().projection(projection));
				});
			});
	}
	
	// In-state v. out-of-state pie chart
	// Change identifier on /candidates filter to change to a different candidate
	
	makePieChart("pie", 2009216, "PA");
	
	function makePieChart(id, target, target_state){
		$.getJSON("api/states/candidates/" + target, function(json) {
			data = [];
			$.each(json.results, function(i, state){ 
				if( state.state == target_state ) data[1] = { label: "In-state", data: state.amount};
				else if ( i == 0 ) data.push({ label: "Out of state", data: parseFloat(state.amount)}) 
				else data[0].data += parseFloat(state.amount);
			});
			$.plot('#' + id, data, {
				series: {
					pie: {
						show: true
					}
				}
			});
		});
	}
	
	// END in-state v. out-of-state
	
	// Start time series 
	function makeTimeChart(id, endpoint, target, startDate, endDate){
		$.getJSON("api/months/" + endpoint + "/" + target + "?startDate=" + startDate + "&endDate=" + endDate, function(json){
			
			data = [];
			$.each(json.results, function(i, date){
				data.push( [Date.parse(date["year"] + "-" + date["month"] + "-" + "01"), date["total"]] );
				
				
				$.plot("#" + id, [{ 
					data: data, 
					color:"seagreen"
					
					
				}], {
					series: {
						lines:{
							lineWidth: 6,
							show:true
						},
						points:{
							show:true
						}
					},
					xaxis: { 
						mode: "time",
						min: data[0][0]	
					},
					yaxis: {
						tickFormatter: function(val, axis){
							return "$" + numberWithCommas(val);
						},
						min: 0
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
							$("#tooltip").html("<div class='date'>" + new Date(item.datapoint[0]).getMonth() + "/" + new Date(item.datapoint[0]).getFullYear() + "</div><div class='text'>" + toDollars(item.datapoint[1]) + "</div>");
						}
						else {
							
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
	
	
	makeTimeChart("timechart", "candidates", 2009216, "2013-01-01", "2014-09-01");
	
});

function toDollars(x){
	return "$" + numberWithCommas( Math.floor(x * 100) / 100 );
}

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

