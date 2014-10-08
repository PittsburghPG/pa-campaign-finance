var map;



$(document).ready(function() {

 //parse url
 var pathname = window.location.pathname; //get current url
 var split = pathname.split("/"); //treat it like a string, break it up where the /'s are
 //console.log(split[2]);
 var apiURL = split[2] + "/" + split[3];
 //console.log(apiURL);
 //case statement

 switch(split[2]) { //the second item in the array will be the type of page this will be
    case "search":
		
		var content = $("#main");
		urlparameters = getURLParameters();
		console.log(urlparameters);
		// Start it off with dummy value so the rest can just start with &'s
		var parameters = "?";
		$.each(urlparameters, function(i, parameter){
			parameters += "&" + parameter.key + "=" + parameter.value;
		});
		console.log(parameters);
		// Contributions portion
		$.getJSON("/api/contributions/" + parameters + "&limit=25", function(data){
			console.log(data);
			content.append('<div class = "row"> \
								<div class="col-lg-12 col-md-12 col-sm-12" id = "contributions"> \
									<h3>Contributions matching search</h3> \
									<table class="table table-hover sortable"> \
										<thead> \
											<tr><th data-defaultsort = "DESC">Date</th><th>Contributor</th><th>Candidate/PAC</th><th>County</th><th style="text-align:right">Amount</th></tr> \
										</thead> \
										<tbody></tbody> \
									</table> \
								</div> \
							</div>'); 
			appendRows(data, $("#contributions"), "contributions");
			
			// Only insert "more" button if there are exactly 25 rows. I know this is hacky but I don't feel 
			// like making a better solution. <3 andrew
			if(data.results.length >= 25) {
				button = $('<button type="button" class="btn btn-default btn-md btn-block">More results</button>').appendTo($("#contributions"))
					.on("click", function(){
					this.remove();
					$.getJSON("/api/contributions/" + parameters + "&limit=9999999&offset=25", function(data){
						appendRows(data, $("#contributions"), "contributions");
						$.bootstrapSortable(applyLast=true);
					});
				});
			}
			$.bootstrapSortable();
			content.append('<div class="thin-divider"></div>');
			
			// Contributor time
			$.getJSON("/api/contributors/" + parameters + "&limit=25", function(data){
				content.append('<div class = "row"> \
									<div class="col-lg-12 col-md-12 col-sm-12" id = "contributors"> \
										<h3>Contributors matching search</h3> \
										<table class="table table-hover sortable"> \
											<thead> \
												<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Occupation</th><th>empName</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
											</thead> \
											<tbody></tbody> \
										</table> \
									</div> \
								</div>'); 
				appendRows(data, $("#contributors"), "contributors");
				if(data.results.length >= 25) {
					button = $('<button type="button" class="btn btn-default btn-md btn-block">More results</button>').appendTo($("#contributors"))
						.on("click", function(){
							this.remove();
						$.getJSON("/api/contributors/" + parameters + "&limit=9999999&offset=25", function(data){
							appendRows(data, $("#contributors"), "contributors");
							$.bootstrapSortable(applyLast=true);
						});
					});
				}
				$.bootstrapSortable();
			});
		});
	break;
	
    case "candidates":
        $('#bycandidate').addClass('active'); //make the dropdown menu active on the correct item
				//var candName = decodeURIComponent(split[3]); //grab the candidate name from the url
				//console.log(toTitleCase(candName));
				//console.log(apiURL);
		
		$.ajax({
			url: "api/" + apiURL,
			dataType: "json",
			type : "GET",
			success : function(r) {
				var name = r.results[0].name;
				var party = r.results[0].party;
				if (party == 'REP') { party = "Republican";}
				if (party == 'DEM') { party = "Democratic";}
				var total = r.results[0].total;
				var average = r.results[0].average;
				var address1 = r.results[0].address1;
				var address2 = r.results[0].address2;
				var city = r.results[0].city;
				city = city.toLowerCase();
				city = toTitleCase(city);
				var state = r.results[0].state;
				var zip = r.results[0].zip;
				var phone = r.results[0].phone;
				phone = phone.insert(3, "."); //format phone number
				phone = phone.insert(7, ".");
			  
				//intro row 

				var container = $("#main");
				introRow = $("<div></div>").appendTo(container);	
				introRow.addClass("row intro-row");
				
				var introLabel = $("<label>CANDIDATE</label>");
				introLabel.appendTo(introRow);
				
				var jumbotron = $("<div></div>").appendTo(introRow);
				jumbotron.addClass("jumbotron");
				
				var candName = $("<h1>" + name + "</h1>");
				candName.appendTo(jumbotron);
				
				var thinDivider = $("<div class='thin-divider'></div>");
					
			  
				//banner image
				var n = name.split(" ");
				var lastName = n[1];
				lastName = lastName.toLowerCase();

				// $( "<div class='banner-image'></div>" ).appendTo('body');
			 	$( "<div class='banner-image'></div>" ).insertAfter( "#main" );

				$('.banner-image').css('background-image', "url('/../img/" + r.results[0].filerid + ".jpg')");
				$('.banner-image').css('background-size', 'cover');
				
				//bio information
				$( "<div class='container' id='data'></div>" ).insertAfter( ".banner-image" );
	
				$('#data').append("<div class='row' id='bio_totals'></div>");
				$('#bio_totals').append("<div id='bio' class='col-lg-5 col-md-5 col-sm-5 col-xs-12'></div>");
				$('#bio').append('<p><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-birthday-cake fa-stack-1x fa-inverse"></i></span><strong id="party"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-phone fa-stack-1x fa-inverse"></i></span><strong id="phone"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i>	<i class="fa fa-envelope fa-stack-1x fa-inverse"></i></span><strong id="address"></strong><br></p><p class="lead">Tom Corbett! What a bro. </p>');
				$('#party').html(party);
	
				$('#address').html(address1 + address2 + ", " + city + ", " + state + " " + zip);
				$('#phone').html(phone);
				$("<div class='thin-divider' id='biodivider'></div>").insertAfter('#data');
			  
				//totals
				$('#bio_totals').append('<div class="col-lg-6 col-md-6 col-sm-7 col-lg-offset-1 col-md-offset-1 top-totals"><div class="row no-margin-top"><div class="col-lg-12 col-md-12 col-sm-12"><label>TOTAL RAISED</label>		<h2 class="jumbo" id="total_raised"></h2></div></div><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block first"><label>$50 AND OVER</label><h3 id="over50"></h3></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block"><label>UNDER $50</label><h3 id="under50"></h3></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block last"><label>AVERAGE DONATION</label><h3 id="average"></h3></div></div></div>');
				//total raised
				var flTotal = parseFloat(total);
				flTotal = Math.round(flTotal);
				$('#total_raised').html(toDollars(flTotal));
			  
				//over $50
				$.ajax({
					url: "api/" + apiURL + "?startAmount=50",
					dataType: "json",
					type : "GET",
					success : function(s) {
						var over50 = parseFloat(s.results[0].total);
						over50 =  Math.round(over50);
						over50 = over50.numberFormat(0);
						$('#over50').html( "$" + over50);
						
					}
				});

				//under $50
				$.ajax({
					url: "api/" + apiURL + "?endAmount=49",
					dataType: "json",
					type : "GET",
					success : function(t) {
						var under50 = parseFloat(t.results[0].total);
						under50 =  Math.round(under50);
						under50 = under50.numberFormat(0);
						$('#under50').html( "$" + under50);
					}
			   });
			   
				//average
				var flAverage = parseFloat(average);
				flAverage =  Math.round(flAverage);
				flAverage = flAverage.numberFormat(0);
				$('#average').html( "$" + flAverage );
				
				$("<div class='thin-divider' id='datadivider'></div>").appendTo($("#data"));
				
				//charts 
				$(' \
				<div class="row graphs"> \
					<div class="col-lg-8 col-md-8 col-sm-8 block"> \
						<h3>County-by-county contributions</h3> \
						<svg id="map" style = "width:100%; height:465px;"></svg> \
					</div> \
					<div class="col-lg-4 col-md-4 col-sm-4" id="graphsSidebar"> \
						<h3>Over time</h3>\
						<div id="timechart" style="width: 100%; height: 200px;"></div>\
						<h3>In state vs. out of state</h3> \
						<div id="pie" style="width: 100%; height: 200px;"></div> \
					</div> \
				</div> \
				<div class="thin-divider"></div>').appendTo( $("#data") );
				
				makePieChart("pie", split[3], "PA");
				makeTimeChart("timechart", "candidates", split[3], "2013-01-01", "2014-09-01");
				
				// Size chart to equal neighboring column
				sizeToMatch($("#map"), $("#graphsSidebar"));
				drawCandidateMap("map");
				
				
				//$("<div class='thin-divider' id='chartdivider'></div>").insertAfter("#charts");
				$("<div class='thin-divider' id='chartdivider'></div>").insertAfter("#charts");
				
				//container.append(thinDivider);
				//get contributor data
				$.ajax({
					url: "api/contributors/filers/" + split[3] + "?limit=25",
					dataType: "json",
					type : "GET",
					success : function(u) {
						$("#data").append(' \
						<div class = "row"> \
							<div class="col-lg-12 col-md-12 col-sm-12" id = "contributors"> \
								<h3>Contributors</h3> \
								<table class="table table-hover sortable"> \
									<thead> \
										<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Occupation</th><th>Employer name</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
									</thead> \
									<tbody></tbody> \
								</table> \
							</div> \
						</div>'); 
						appendRows(u, $("#contributors"), "contributors");
						if(u.results.length >= 25) {
							button = $('<button type="button" class="btn btn-default btn-md btn-block">More results</button>').appendTo($("#contributors"))
								.on("click", function(){
									$(this).after("<div class='loading'>Loading data&nbsp;<i class='fa fa-money fa-spin'></i></div>");
									this.remove();
								$.getJSON("/api/contributors/filers/" +  + split[3] + "&limit=9999999&offset=25", function(data){
									appendRows(data, $("#contributors"), "contributors");
									$.bootstrapSortable(applyLast=true);
									$(".loading").remove();
								});
							});
						}
						$.bootstrapSortable();
					}
				});
				
				//console.log(donorHeight);
				//$("#tableHeightDiv").css({'height': '500px', 'overflow':'hidden'});
					
				
					
				
				
				
			}
		}); // end candidates case api/ + apiURL
		 
			break;
    case "counties":
		$('#bycounty').addClass('active');
		var countyName = split[3];
		
		//countyName = toTitleCase(countyName);
		 $.ajax({
			url: "api/" + apiURL,
			dataType: "json",
			type : "GET",
			success : function(v) {
				//console.log(v.results[0]);
				var container = $("#main");
				
				countyName = toTitleCase(v.results[0].county);
								
				introRow = $("<div></div>").appendTo(container);	
				introRow.addClass("row intro-row");
				
				var introLabel = $("<label>COUNTY</label>");
				introLabel.appendTo(introRow);
				
				var jumbotron = $("<div></div>").appendTo(introRow);
				jumbotron.addClass("jumbotron");
				
				var countyHead = $("<h1>" + countyName + "</h1>");
				countyHead.appendTo(jumbotron);
				
				var thinDivider = $("<div class='thin-divider'></div>");
				
				container.append(thinDivider);
				
				//var mapAndTotals = $("<div class='row'></div>").appendTo(container);
				
				var countyState = v.results[0].state;
				var widthTotals = "";
				if (countyState != "PA"){
					widthTotals = "col-lg-12 col-md-12 col-sm-12";
				}else{
					widthTotals = "col-lg-7 col-md-7 col-sm-8"
				};
				console.log("The state is " + countyState + " and the Totals width will be " + widthTotals);
				
				
				
				
				container.append(' \
				<div class="row "> \
					<div class="col-lg-5 col-md-5 col-sm-4 col-xs-12"> \
						<svg id="map" style="width:100%; height:425px;"></svg> \
					</div> \
					<div class="col-lg-7 col-md-7 col-sm-8 top-totals"> \
						<div class="row"> \
							<div class="col-lg-12 col-md-12 col-sm-12"> \
								<label>TOTAL CONTRIBUTIONS</label> \
								<h2 class="jumbo" id="totalcontributions"></h2> \
							</div> \
						</div> \
						<div class="thin-divider"></div> \
						<div class="row"> \
							<div class="col-lg-12 col-md-12 col-sm-12"> \
								<table class="horizontal-bar-graph" id="candidate-bar-table"></table> \
							</div> \
						</div> \
						<div class="thin-divider"></div> \
						<div class="row"> \
							<div id="county-percent-total" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 block first big-number-with-wrapped-text"></div> \
							<div id="county-per-capita" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 block big-number-with-wrapped-text"></div> \
						</div> \
					</div> \
				</div>');
				
				var corbettContributionAmt = v.results[0].beneficiaries[0].amount; //corbett's contribution amount
				corbettContributionAmt = parseFloat(corbettContributionAmt);
				corbettContributionAmt = Math.round(corbettContributionAmt);
				
				var wolfContributionAmt = v.results[0].beneficiaries[1].amount;//wolf's contribution amount
				wolfContributionAmt = parseFloat(wolfContributionAmt);
				wolfContributionAmt = Math.round(wolfContributionAmt);
		
				var totalcontribs = corbettContributionAmt + wolfContributionAmt;
				formatTotalcontribs = totalcontribs.numberFormat(0);
				
				$('#totalcontributions').html("$" + formatTotalcontribs);
				
				var corbettContributionNum = parseInt(v.results[0].beneficiaries[0].contributions);
				corbettContributionNum = corbettContributionNum.numberFormat();
				
				var wolfContributionNum = parseInt(v.results[0].beneficiaries[1].contributions);
				wolfContributionNum = wolfContributionNum.numberFormat();
				
				var wolfBarWidth = "";
				var corbettBarWidth = "";
				if(wolfContributionAmt > corbettContributionAmt){
					wolfBarWidth = "100";
					corbettBarWidth = (corbettContributionAmt)/(wolfContributionAmt)*100;
				}else if(corbettContributionAmt > wolfContributionAmt){
					corbettBarWidth = "100";
					wolfBarWidth = (wolfContributionAmt)/(corbettContributionAmt) *100;
					//console.log(wolfBarWidth);
				} else{
					corbettBarWidth = "100";
					wolfBarWidth = "100";
				};
				
				//Corbett row --> need to make graphic length respect amt donated 
				var topTotalsCorbettRow = $("<tr><td><strong>Corbett</strong></td><td><div class='bar republican' style='width:" + corbettBarWidth +"%; color:#000000;'></div><span style='overflow:visible;'>$" + corbettContributionAmt.numberFormat() + " (" + corbettContributionNum + " contributions)" + "</span></td></tr>").appendTo("#candidate-bar-table");
				//Wolf row --> need to make graphic length respect amt donated
				var topTotalsWolfRow = $("<tr><td><strong>Wolf</strong></td><td><div class='bar democrat' style='width:" + wolfBarWidth + "%; color:#000000;'></div><span style='overflow:visible;'>$" + wolfContributionAmt.numberFormat() + " (" + wolfContributionNum + " contributions)" + "</span></td></tr>").appendTo("#candidate-bar-table");
		
				
				//get population - don't have right now
				var population = 1229000;
				
				$.ajax({
					url: "api/counties",
					dataType: "json",
					type : "GET",
					success : function(w) {
						var totalAllCountyDonations = 0; //total of all counties
						//totalContributions = total for THIS county
						
						for (var i = 0; i< w.results.length; i++) {
							totalAllCountyDonations += Math.round(parseFloat(w.results[i].amount));
							//console.log(Math.round(parseFloat(w.results[i].amount)));
						}
						//console.log(totalAllCountyDonations);
						//console.log(totalAllCountyDonations + " " + totalcontribs);
						var thisCountyPercent = totalcontribs/totalAllCountyDonations*100;
						thisCountyPercent = thisCountyPercent.numberFormat(1);
						
						
						$("<h3>" + thisCountyPercent + "%</h3><label>" + countyName + " County represents " + thisCountyPercent + "% of total race contributions.</label>").appendTo("#county-percent-total");
						
						//per capita
						var perCapita = totalcontribs/population;
						perCapita = perCapita.numberFormat(2);
						
						$("<h3>$" + perCapita + "</h3><label>Contributions represent $" + perCapita + " per capita in " + countyName + " County.</label>").appendTo("#county-per-capita")
						
						// Size chart to equal neighboring column
						sizeToMatch($("#map"), $(".top-totals"));
						drawLocatorMap("map", countyName);
				
						
					}
					
					
				}); //end counties case api/counties
				
				container.append("<div class='thin-divider'></div>");
				
				container.append('<div class="row divider">\
					<div class="col-lg-6 col-md-6 col-sm-6 block"><h3>Contributions over time</h3>\
						<div id="timeline" style="width: 100%; height: 200px;"></div>\
					</div>\
					<div class="col-lg-6 col-md-6 col-sm-6 block"><h3>Contributions by candidate</h3>\
						<div id = "both-candidates-timeline" style = "width:100%; height:200px;"></div>\
					</div></div></div>');
				
				makeTimeChart("timeline", "counties", countyName, "2013-01-01", "2014-09-01");
				makeCandidateTimeChart("both-candidates-timeline", "2013-01-01", "2014-09-01", countyName)
				container.append("<div class='thin-divider'></div>");
				
				$.ajax({
					url: "api/contributors/counties/" + countyName + "?limit=25",
					dataType: "json",
					type : "GET",
					success : function(u) {
						$("#main").append(' \
						<div class = "row"> \
							<div class="col-lg-12 col-md-12 col-sm-12" id = "contributors"> \
								<h3>Contributors</h3> \
								<table class="table table-hover sortable"> \
									<thead> \
										<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Occupation</th><th>Employer name</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
									</thead> \
									<tbody></tbody> \
								</table> \
							</div> \
						</div>'); 
						appendRows(u, $("#contributors"), "contributors");
						
						if(u.results.length >= 25) {
							button = $('<button type="button" class="btn btn-default btn-md btn-block">More results</button>').appendTo($("#contributors"))
								.on("click", function(){
									$(this).after("<div class='loading'>Loading data&nbsp;<i class='fa fa-money fa-spin'></i></div>");
									this.remove();
								$.getJSON("/api/contributors/" + split[2] + "/" + split[3] + "&limit=9999999&offset=25", function(data){
									appendRows(data, $("#contributors"), "contributors");
									$.bootstrapSortable(applyLast=true);
									$(".loading").remove();
								});
							});
						}
						$.bootstrapSortable();
					}
				});
							
			}//end success
		}); // end counties case api/ + apiURL
	  
	break;
	case "contributors":
			$('#bycontributor').addClass('active');
			var contributorName = split[3];
			break;
	case "contributions":
			$('#bycontributor').addClass('active');
			var contributionID = split[3];
			break;
			default:
     	//default code block
 } // first switch
}); //end document ready

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