function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Converts XXXXXX.XXXXX to $XXX,XXX.XX
function toDollars(x){
	return "$" + numberWithCommas(Math.round(Math.floor(x * 100) / 100 ));
}

// Converts XXXXXXXX to XX,XXX,XXX
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//formats data correctly

function monthDayYear(date){
			var d = new Date(date);
			var con_date = d.getDate(date);
			var con_month = d.getMonth(date);
			var con_year = d.getFullYear(date);
			return contributionDate = con_month + "/" + con_date + "/" + con_year;
			
}

function makeTimeChart(id, endpoint, target, startDate, endDate){

	$.getJSON("api/months/" + endpoint + "/" + target + "?startDate=" + startDate + "&endDate=" + endDate, function(json){
		data = [];
		count = 0;
		$.each(json.results, function(i, date){
			data.push( [Date.parse(date["year"] + "-" + pad(date["month"],2) + "-" + "01T05:01:00"), date["total"]] );
			count = i;
		});	
		
		
		$.plot("#" + id, [{ 
			data: data, 
			color:"seagreen"
		}], {
			series: {
				bars:{
					barWidth: 1000000000,
					fillColor: "seagreen",
					show: true,
					order: 1
				}
			},
			xaxis: { 
				mode: "time",
				min: 1357014127000,
				max: 1417321327000
				//min: data[0][0] - 100000000,
				//max: data[count][0] + 100000000
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
				hoverable: true,
				clickable: true
			},
			markings:0
		});
		
		$("#" + id).bind("plotclick", function(event, pos, item){
			if( item ){
				start = new Date(item.datapoint[0]);
				end =  new Date(item.datapoint[0]);
				end.setMonth(end.getMonth() + 1);
				end.setDate(-1);
				url = "/a/search/?" + endpoint + "=" + target + "&startDate=" + start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + "&endDate=" + end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
				pymChild.sendMessage('url-tracker', url);
				window.location = url;
			}
		});
		
		$("#" + id).bind("plothover", function(event, pos, item){
			if( item ) {
				if( $("#tooltip").length == 0 ){
					$("<div id='tooltip'></div>").appendTo( $("body") )
						.css({top: item.pageY+5, left: item.pageX+5});
					$("#tooltip").html("<div class='date'>" + ( new Date(item.datapoint[0]).getMonth() + 1 ) + "/" + new Date(item.datapoint[0]).getFullYear() + "</div><div class='text'>" + toDollars(item.datapoint[1]) + "</div>");
				}
				else {
					$("#tooltip").css({top: item.pageY-20, left: item.pageX+10});
				}
			}
			else $("#tooltip").remove();
		});
		
		
		
	});
}

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
					show: true,
					hoverable: true
				}
			},
			grid: {
				hoverable: true
			}
		});
		$("#" + id).bind("plothover", function(e, pos, item){
			if( item ) {
				if( $("#tooltip").length == 0 ){
					$("<div id='tooltip'></div>").appendTo( $("body") );
				}
				$("#tooltip").css({top: pos.pageY-20, left: pos.pageX+10});
				$("#tooltip").html("<div class='text'>" + Math.floor(item.datapoint[0]) + "%</div>");
			}
			
			else $("#tooltip").remove();
		});
	});
}
	
function drawCandidateMap( id ){
	map = d3.select("#" + id);
	w = $(map.node()).width();
	h = $(map.node()).height();
	var counties = [];
	$.getJSON("/api/counties/states/PA", function(countiesJSON){
		$.each(countiesJSON.results, function(i, county){
			county.beneficiaries.sort(function(a,b){
				return +b.amount - +a.amount;
			});
			counties[county.county] = { county: county.county, winner: county.beneficiaries[0].party, candidates: county.beneficiaries };
		});
		d3.json("/js/min.pennsylvania.json", function(error, json) {
			// Join shapefile data
			county = d3.select("#map")
			.selectAll("path")
				.data(json.features)
			.enter().append("path")
				.attr("class", function(d){
					var output = "county";
					if(counties[d.properties.NAMELSAD]){
						output += " " + counties[d.properties.NAMELSAD].winner;
					}
					return output;
				})
				.on("mousemove", function(d){
					d3.select("#tooltip").remove();
					d3.select("body").append("div")
						.attr("id", "tooltip")
						.attr("class", "formap")
						.html(function(){
							output = "<h4>" + d.properties.NAME + "</h4><table><tbody>";
							if( counties[d.properties.NAME] ){
								$.each(	counties[d.properties.NAMELSAD].candidates, function(i, candidate){
									output += "<tr><td>" + candidate.name + "</td><td><strong>" + toDollars(candidate.amount) + "</td></tr>";
								});
							}
							return output + "</tbody></table>";
						})
						.style("left", d3.event.clientX + 10 + "px")
						.style("top", d3.event.clientY - 20 + "px");
				})
				.on("mouseout", function(d){
					d3.select("#tooltip").remove();
				})
				.on("click", function(d){
					pymChild.sendMessage('url-tracker', "/a/counties/" + d.properties.NAMELSAD + "/states/PA");
					window.location = "/a/counties/" + d.properties.NAMELSAD + "/states/PA";
				});
				
			// Detetct orientation of screen and scale map accordingly.
			var bounds = d3.geo.path().bounds(json);
			
			resize();
				
			
			// Make event to resize map on screen resize.
			$(document).on("resize", resize);
			
			function resize(){
				w = $(map.node()).width();
				h = $(map.node()).height();
				
				// Chooses a mercator projection, sticks it roughly in the center of the screen,
				// sets the center of Pennsylvania, scales it up based on bounds of map
				projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
				
				// Apply transformation
				county.attr("d", d3.geo.path().projection(projection));
				console.log("yo");
			}
			
		});
	});
}

function drawLocatorMap( id, county ){
	map = d3.select("#" + id);
	w = $(map.node()).width();
	h = $(map.node()).height();
	
	d3.json("/js/min.pennsylvania.json", function(error, json) {
		// Join shapefile data
		county = map.selectAll("path")
			.data(json.features)
		.enter().append("path")
			.attr("class", function(d){
				var output = "county";
				if(d.properties.NAMELSAD == county) output += " selected";
				return output;
			})
			.on("mousemove", function(d){
				d3.select("#tooltip").remove();
				d3.select("body").append("div")
					.attr("id", "tooltip")
					.attr("class", "formap")
					.html("<h4>" + d.properties.NAME + "</h4>")
					.style("left", d3.event.clientX + 10 + "px")
					.style("top", d3.event.clientY - 20 + "px");
			})
			.on("mouseout", function(d){
				d3.select("#tooltip").remove();
			})
			.on("click", function(d){
				pymChild.sendMessage('url-tracker', "/a/counties/" + d.properties.NAMELSAD + "/states/PA");
				window.location = "/a/counties/" + d.properties.NAMELSAD + "/states/PA";
			});
		
		// Detetct orientation of screen and scale map accordingly.
		var bounds = d3.geo.path().bounds(json);
		
		resize();
					
		// Make event to resize map on screen resize.
		$(document).on("resize", resize);
		
		function resize(){
			w = $(map.node()).width();
			h = $(map.node()).height();
			
			// Chooses a mercator projection, sticks it roughly in the center of the screen,
			// sets the center of Pennsylvania, scales it up based on bounds of map
			projection = d3.geo.mercator().translate([ w / 2.2, h / 1.8]).center([-77.995133, 40.696298]).scale( 800 * w / (bounds[1][0] - bounds[0][0]) );	
			
			// Apply transformation
			county.attr("d", d3.geo.path().projection(projection));
			console.log("yo");
		}
		
	});
}

function getURLParameters(){
	param = decodeURI(window.location.search);
	param = param.split("?");
	param = param[1].split("&");
	param = param.map(function(a){ 
		b = a.split("="); 
		return { key: b[0], value: b[1] }
	});
	return param;
}

function appendRows(data, parent, type){
	switch(type){
		case "contributions":
			$.each(data.results, function(i, contribution){
				$(parent).find("tbody").append("\
				<tr> \
					<td><a href='/a/contributions/" + contribution.id + "'>" + contribution.date + "</a></td> \
					<td><a href='/a/contributors/" + contribution.contributorid + "'>" + contribution.contributor + "</a></td> \
					<td><a href='/a/candidates/" + contribution.filerid + "'>" + contribution.name + "</a></td> \
					<td><a href='/a/counties/" + contribution.county + "/states/" + contribution.state + "'>" + contribution.county + "</a></td> \
					<td style='text-align:right'  data-value='" + parseFloat(contribution.contribution)	 + "'>" + toDollars(contribution.contribution) + "</td> \
				</tr>");
			});
		break;
		
		case "contributors":
			// Arrange totals to determine preferred candidate
			
			$.each(data.results, function(i, contributor){
				contributor.beneficiaries.sort(function(a,b){
					return b.amount - a.amount;
				});
				
				$(parent).find("tbody").append("\
				<tr> \
					<td><a href='/a/contributors/" + contributor.contributorid + "'>" + contributor.contributor + "</a></td> \
					<td>" + contributor.city + "</td> \
					<td><a href='/a/counties/" + contributor.county + "/states/" + contributor.state + "'>" + contributor.county + "</a></td> \
					<td>" + contributor.state + "</td> \
					<td>" + contributor.empName + "</td> \
					<td>" + contributor.beneficiaries[0].name + "</td> \
					<td style='text-align:right' data-value='" + parseFloat(contributor.amount) + "'>" + toDollars(contributor.amount) + "</td> \
				</tr>");
			});
		break;
	
	}
}

function sizeToMatch(item, target){
	
	item.height( target.height() );
}

function makeGoogleMap(locationCity, locationZip, id){
	$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + locationCity + "&components=postal_code:" + locationZip, function(geodata){
		var contribLAT = geodata.results[0].geometry.location.lat;
		var contribLNG = geodata.results[0].geometry.location.lng;
		var mapOptions = {
			center: { lat: contribLAT, lng: contribLNG},
			zoom: 8,
			disableDefaultUI: true,
			scrollwheel: false,
			draggable: false
		};
		var Gmap = new google.maps.Map(document.getElementById(id), mapOptions);
		  
		var addressMarker = new google.maps.Marker({
			position: { lat: contribLAT, lng: contribLNG},
			map: Gmap,
			title:locationCity
		});
	
	});
}

function makeCandidateTimeChart(id, startDate, endDate, county){
	
	// See if county was specified
	county = (typeof county == "undefined") ? "" : "/counties/" + county;
	dataCollection = [];
	$.getJSON("api/candidates/", function(json){
		
		// Sort by party so chart colors match according to our red/blue conventions
		json.results.sort(function(a,b){ 
			if(a.party == "REP") return 1; else return -1;
		});
		
		$.each(json.results, function(i, candidate){
			var data = [];
			$.getJSON("api/months/candidates/" + candidate.filerid + county + "?startDate=" + startDate + "&endDate=" + endDate, function(subjson){
				$.each(subjson.results, function(j, date){
					data.push( [Date.parse(date["year"] + "-" + pad(date["month"],2) + "-" + "01T05:01:00"), +date["total"]] );
				});	
				dataCollection.push({ label: candidate.name, data: data});
				
				
				
				$.plot("#" + id, dataCollection, { 
							legend:	{
								show:true
							},
							series:  {
								lines:{
									lineWidth: 5,
									fillColor: "seagreen",
									show: true,
									order: 1
								},
								points:{
									show: true
								}
							},
							xaxis: { 
								mode: "time",
								min: 1357014127000,
								max: 1417321327000
								//min: data[0][0] - 100000000,
								//max: data[count][0] + 100000000
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
								hoverable: true,
								clickable: true
							},
							markings:0,
							colors: [ "#2E4272", "#AA3939"]
						});
				
			});			
		});
		
		
		
		$("#" + id).bind("plothover", function(event, pos, item){
			if( item ) {
				if( $("#tooltip").length == 0 ){
					$("<div id='tooltip'></div>").appendTo( $("body") )
						.css({top: item.pageY+5, left: item.pageX+5});
					$("#tooltip").html("<div class='date'>" + ( new Date(item.datapoint[0]).getMonth() + 1 ) + "/" + new Date(item.datapoint[0]).getFullYear() + "</div><div class='text'>" + toDollars(item.datapoint[1]) + "</div>");
				}
				else {
					$("#tooltip").css({top: item.pageY-20, left: item.pageX+10});
				}
			}
			else $("#tooltip").remove();
		});
		
		$("#" + id).bind("plotclick", function(event, pos, item){
			if( item ) {
				console.log(item);
				start = new Date(item.datapoint[0]);
				end =  new Date(item.datapoint[0]);
				end.setMonth(end.getMonth() + 1);
				end.setDate(-1);
				url = "/a/search/?candidatename=" + item.series.label + "&startDate=" + start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + "&endDate=" + end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
				pymChild.sendMessage('url-tracker', url);
				window.location = url;
				
			}
		});
	});
}

function pad(num, size){ return ('000000000' + num).substr(-size); }


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
//insert something into a string
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};
//add thousands commas to number
Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}