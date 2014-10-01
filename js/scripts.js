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
	
	
	case "contributors":
       $('#bycontributor').addClass('active');
	   var contribID = split[3];
	   
	   $.getJSON("/api/contributors/" + contribID, function(data){
	   		
	   		//var need = "{need variable}";
	   		
	   		
		   	//intro row
				var container = $("#main");
				introRow = $("<div></div>").appendTo(container);	
				introRow.addClass("row intro-row");
				
				var introLabel = $("<label>CONTRIBUTOR</label>");
				introLabel.appendTo(introRow);
				
				var jumbotron = $("<div></div>").appendTo(introRow);
				jumbotron.addClass("jumbotron");
				
				var contribName = data.results[0].contributor;
				
				var headerAmt = $("<h1>" + contribName + "</h1>");
				headerAmt.appendTo(jumbotron);
				
				var contribJob = data.results[0].occupation;
				var contribEmp = data.results[0].empName;
				
				//console.log(contribJob.length);
				
				var contribTitle = "";
				if((contribJob.length > 0) && (contribEmp.length > 0)){
					contribTitle = "<small>" + contribJob + ", " + contribEmp + "</small>";
				}else if ((contribJob.length > 0) && (contribEmp.length == 0)){
					contribTitle = "<small>" + contribJob + "</small>";
				}else if ((contribJob.length == 0) && (contribEmp.length > 0)){
					contribTitle = ", <small>" + contribEmp + "</small>"; 
				}else {
					contribTitle = "";
				};
				$(contribTitle).appendTo(headerAmt);
				
				
				var thinDivider = $("<div class='thin-divider'></div>");
				thinDivider.appendTo(jumbotron);
	   
	   
				// top totals row
				var topTotals = $("<div class='row top-totals'></div>").appendTo(container);
				
				var topTotalsLeft = $("<div class='col-lg-4 col-md-4 col-sm-4 col-xs-12 block first'></div>").appendTo(topTotals);
				
				// Location block	
				var locationCity = data.results[0].city;
				var locationZip = data.results[0].zip;
				var topTotalsLeftLocationBlock = $("<div class='row'><div class='col-lg-12 col-md-12 col-sm-12'><label>LOCATION</label><h3>" + locationCity + "</h3><p>" + locationZip + "</p></div></div>" ).appendTo(topTotalsLeft);
	   
				thinDivider.appendTo(topTotalsLeft);
	   
				//Top contributed block
				var topTotalsContrib = $("<div class='row'></div>").appendTo(topTotalsLeft);
				var topTotalsContribCol12 = $("<div class='col-lg-12 col-md-12 col-sm-12'></div>").appendTo(topTotalsContrib);
	   
				var contributionTotal = data.results[0].amount;
				var topTotalsContribLabel = $("<label>TOP CONTRIBUTED</label><h3>" + contributionTotal + "</h3>").appendTo(topTotalsContribCol12);
				
				//Candidate breakdown table
				var topTotalsContribCandidate = $("<div class='row'></div>").appendTo(topTotalsContribCol12);
				var topTotalsContribCandidateCol12 = $("<div class='col-lg-12 col-md-12 col-sm-12'></div>").appendTo(topTotalsContribCandidate);
				var topTotalsContribCandidateTable = $("<table class='horizontal-bar-graph'></table>").appendTo(topTotalsContribCandidateCol12);
				
				
				
				
				//Corbett_Wolf variables and logic 
				var wolfContributionAmt = "";
				var wolfContributionNum = "";
				var results = data.results[0].beneficiaries;
				$.each(results, function(i, item){
					if(results[i].filerid == "20130153"){
						wolfContributionAmt = results[i].amount;
						wolfContributionNum = results[i].contributions;
					}else {
						wolfContributionAmt = "0";
						wolfContributionNum = "0";
					}
				});
				
				var corbettContributionAmt = "";
				var corbettContributionNum = "";
				var results = data.results[0].beneficiaries;
				$.each(results, function(i, item){
					if(results[i].filerid == "2009216"){
						corbettContributionAmt = results[i].amount;
						corbettContributionNum = results[i].contributions;
					}else {
						corbettContributionAmt = "0";
						corbettContributionNum = "0";
					}
				});
				
				var wolfBarWidth = "";
				var corbettBarWidth = "";
				if(wolfContributionAmt > corbettContributionAmt){
					wolfBarWidth = "100";
					corbettBarWidth = (corbettContributionAmt)/(wolfContributionAmt);
				}else if(corbettContributionAmt > wolfContributionAmt){
					corbettBarWidth = "100";
					wolfBarWidth = (wolfContributionAmt)/(corbettContributionAmt);
				} else{
					corbettBarWidth = "100";
					wolfBarWidth = "100";
				};
				
				
				//Corbett row --> need to make graphic length respect amt donated 
				var topTotalsCorbettRow = $("<tr><td><strong>Corbett</strong></td><td><div class='bar republican' style='width:" + corbettBarWidth +"%; color:#000000;'></div><span style='overflow:visible;'>" + corbettContributionAmt + " (" + corbettContributionNum + " donations)" + "</span></td></tr>").appendTo(topTotalsContribCandidateTable);
				
				
				//Wolf row --> need to make graphic length respect amt donated
				var topTotalsWolfRow = $("<tr><td><strong>Wolf</strong></td><td><div class='bar democrat' style='width:" + wolfBarWidth + "%; color:#000000;'></div><span style='overflow:visible;'>" + wolfContributionAmt + " (" + wolfContributionNum + " donations)" + "</span></td></tr>").appendTo(topTotalsContribCandidateTable);
				
				//Overtime
				var topTotalsOvertime = $("<div class='col-lg-8 col-md-8 col-sm-8 col-xs-12 block last'>").appendTo(topTotals);
				var topTotalsOvertimeGraph = $("<h3>Contributions over time</h3><div id='timechart' style='width:100%; height:400px'></div>").appendTo(topTotalsOvertime);
				makeTimeChart("timechart", "contributors", contribID, "2013-01-01", "2014-11-01");
	   
	   
				thinDivider.appendTo(container);
				
				container.append(thinDivider);
				
				container.append('<div class="row tabular"><div class="col-lg-12 col-md-12 col-sm-12"><h3>Other donations by ' + contribName +'</h3><form class="form-inline pull-right"><input type="search" class="form-control" placeholder="Search"><button type="submit" class="btn btn-default">Submit</button></form><table class="table table-hover sortable"><thead><tr><th>Donor</th> <th>Occupation, Employer</th><th>Amount</th></tr></thead><tbody></tbody></table></div></div> ');
				
				//get contributor data
				$.getJSON("/api/contributors/" + contribID, function(data){
					console.log(data.results[0].contributor);
					console.log(data.results.length);
					
					var line;
					for(var i =0; i < data.results.length; i++) {
						var emp;
						if (data.results[i].occupation == '') { //don't show comma if there's no occupation
							emp = data.results[i].empName;
						} else {
							emp = data.results[i].occupation + ", " + data.results[i].empName;
						}
						line = "<tr><td>" + data.results[i].contributor + "</td><td>" +  emp  + "</td><td align='right'>$" + data.results[i].amount + "</td></tr>";
						console.log(line);
						$('tbody').append(line);
					}
					
				});	   

			});
	   
	   
	   
	   
	 
	   
	   
	   
	   
        break;
		case "contributions":
         $('#bycontributor').addClass('active');
		  var contributionID = split[3];
        
			$.getJSON("/api/contributions/" + contributionID, function(data){
				var contribName = data.results[0].contributor;
				var contributionAmt = "$" + data.results[0].contribution;
				
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
					 locationZip = locationZip.substring(0,5);
				
				
				
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
						var dateData = $("<span>" + contributionDate + "</span>").appendTo(dateItem);
						
						
						var locationItem = $(h3).appendTo(contributionColumn);
						locationItem.addClass("location-item");
						var locationLabel = $("<strong>Location: </strong>").appendTo(locationItem);
						var locationData = $("<span>" + locationCity + ", " + locationZip + "</span>").appendTo(locationItem);
						
						function initialize() {
					    var mapOptions = {
					      center: { lat: -34.397, lng: 150.644},
					      zoom: 8
					    };
					    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
					  };
						google.maps.event.addDomListener(window, 'load', initialize);
						mapColumn = $("<div class='col-lg-7 col-md-7 col-sm-7' id='map-canvas' style='height:100%;'></div>").appendTo(contributionRow);
						$(map).appendTo(mapColumn);
						
						//var countyMap = $("<img class='sm_county_map' src='/img/allegheny-map.png' alt='Allegheny County locator map'>").appendTo(mapColumn);
						
					
					
					
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
	