var map;
$(document).ready(function() {
 /* var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(40.4450813, -80.00877459999998),
	disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);*/

 //parse url
 var pathname = window.location.pathname; //get current url
 var split = pathname.split("/"); //treat it like a string, break it up where the /'s are
 //console.log(split[2]);
 
 //case statement
 switch(split[2]) { //the second item in the array will be the type of page this will be
    case "candidates":
        $('#bycandidate').addClass('active'); //make the dropdown menu active on the correct item
		var candName = decodeURIComponent(split[3]); //grab the candidate name from the url
		console.log(toTitleCase(candName));
        break;
    case "counties":
      $('#bycounty').addClass('active');
	  var countyName = split[3];
		console.log("one more tiiiiiiiiiime");
		console.log("we're gonna celebrate");
	break;
	case "contributor":
       $('#bycontributor').addClass('active');
	   var contributorName = split[3];
	   
	   //intro row
			var container = $("#main");
			introRow = $("<div></div>").appendTo(container);	
			introRow.addClass("row intro-row");
			
			var introLabel = $("<label>CONTRIBUTOR</label>");
			introLabel.appendTo(introRow);
			
			var jumbotron = $("<div></div>").appendTo(introRow);
			jumbotron.addClass("jumbotron");
			
			var headerAmt = $("<h1>" + contributionAmt + "</h1>");
			headerAmt.appendTo(jumbotron);
			
			var thinDivider = $("<div class='thin-divider'></div>");
			thinDivider.appendTo(jumbotron);
	   
	   
	   

	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
        break;
	case "contributions":
         $('#bycontributor').addClass('active');
		  var contributionID = split[3];
        
			$.getJSON("/api/contributions/" + contributionID, function(data){
				var contribName = data.results[0].contributor;
				var contributionAmt = "$" + data.results[0].contribution;
				//var locationZip = data.results[0].newzip;
				//var locationCity = data.results[0].city;
				
				var conDateRaw = data.results[0].date;
				var d = new Date(conDateRaw);
				var con_date = d.getDate(conDateRaw);
				var con_month = d.getMonth(conDateRaw);
				var con_year = d.getFullYear(conDateRaw);
				var contributionDate = con_month + "/" + con_date + "/" + con_year;
				
				var filerID = data.results[0].filerid;
				
				$.getJSON("/api/contributors/" + contribName, function(data){
					 var locationCity = data.results[0].city;
					 var locationZip = data.results[0].zip;
					 locationZip.substring(0,5);
				
				
				
					$.getJSON("/api/candidates/", function(data){
						
						var candidateName = "";
						var results = data.results;
						$.each(results, function(i, item){
							if(results[i].filerid == filerID){
								candidateName = results[i].name;
							}
						});
						
						
						//intro row
						var container = $("#main");
						introRow = $("<div></div>").appendTo(container);	
						introRow.addClass("row intro-row");
						
						var introLabel = $("<label>CONTRIBUTION</label>");
						introLabel.appendTo(introRow);
						
						var jumbotron = $("<div></div>").appendTo(introRow);
						jumbotron.addClass("jumbotron");
						
						var headerAmt = $("<h1>" + contributionAmt + "</h1>");
						headerAmt.appendTo(jumbotron);
						
						var thinDivider = $("<div class='thin-divider'></div>");
						thinDivider.appendTo(jumbotron);
						
						
						//donation info row
						contributionRow = $("<div></div>").appendTo(container);
						contributionRow.addClass("row");
						
						var colmd5 = "col-md-5";
						var collg7 = "col-lg-7";
						var colmd7 = "col-md-7";
						var colsm7 = "col-sm-7";
						
						contributionColumn = $("<div></div>").appendTo(contributionRow);
						contributionColumn.addClass(colmd5);
						
						var h3 = "<h3></h3>";
						
						var contribItem = $(h3).appendTo(contributionColumn);
						contribItem.addClass("donor-item");
						var contribLabel = $("<strong>Donor: </strong>").appendTo(contribItem);
						var contribLink = $("<a>" + contribName + "</a>").appendTo(contribItem);
						contribLink.attr("href", "/a/contributors/" + contribName);
						
						var candidateItem = $(h3).appendTo(contributionColumn);
						candidateItem.addClass("candidate-item");
						var candidateLabel = $("<strong>Candidate: </strong>").appendTo(candidateItem);
						var candidateLink = $("<a>" + candidateName + "</a>").appendTo(candidateItem);
						candidateLink.attr("href", "/a/candidates/" + candidateName);
						
						var dateItem = $(h3).appendTo(contributionColumn);
						dateItem.addClass("date-item");
						var dateLabel = $("<strong>Date: </strong>").appendTo(dateItem);
						//why can I not omit the <span> below?
						var dateData = $("<span>" + contributionDate + "</span>").appendTo(dateItem);
						
						
						var locationItem = $(h3).appendTo(contributionColumn);
						locationItem.addClass("location-item");
						var locationLabel = $("<strong>Location: </strong>").appendTo(locationItem);
						//why can I not omit the <span> below?
						var locationData = $("<span>" + locationCity + ", " + locationZip + "</span>").appendTo(locationItem);
						
						mapColumn = $("<div></div>").appendTo(contributionRow);
						mapColumn.addClass(collg7 + " " + colmd7 + " " + colsm7);
						
						var countyMap = $("<img>").appendTo(mapColumn);
						countyMap.addClass("sm_county_map");
						countyMap.attr("src", "/img/allegheny-map.png");
						countyMap.attr("alt", "Allegheny County locator map");
					
					
					
					});
					
				
				});
				
			});
		
		
		
		
		break;
    default:
        //default //code block
}
 
	  
});

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Converts XXXXXX.XXXXX to $XXX,XXX.XX
function toDollars(x){
	return "$" + numberWithCommas( Math.floor(x * 100) / 100 );
}

// Converts XXXXXXXX to XX,XXX,XXX
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
							$("#tooltip").html("<div class='date'>" + new Date(item.datapoint[0]).getMonth() + "/" + new Date(item.datapoint[0]).getFullYear() + "</div><div class='text'>" + toDollar(item.datapoint[1]) + "</div>");
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
	