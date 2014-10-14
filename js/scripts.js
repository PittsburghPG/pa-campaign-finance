var map;
var pymChild;

$(document).ready(function() {      

	// Build pym child
	pymChild = new pym.Child({ polling:500, renderCallback: function(){ pym.Child } });	
	$(document).on("click", "a", function(){ 
		// if statement fixes search button bug on embed
		if( !$(this).parent().hasClass("dropdown") ) pymChild.sendMessage('url-tracker', $(this).attr("href")); 
	});
	
	
 //parse url
 var pathname = window.location.pathname; //get current url
 var split = pathname.split("/"); //treat it like a string, break it up where the /'s are
 var apiURL = split[2] + "/" + split[3];
 
 //case statement
 switch(split[2]) { //the second item in the array will be the type of page this will be
    case "candidates":
        $('#bycandidate').addClass('active'); //make the dropdown menu active on the correct item

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
					
			  
				// Banner image
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
				$('#bio').append('<p><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-birthday-cake fa-stack-1x fa-inverse"></i></span><strong id="party"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-phone fa-stack-1x fa-inverse"></i></span><strong id="phone"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i>	<i class="fa fa-envelope fa-stack-1x fa-inverse"></i></span><strong id="address"></strong><br></p><p class="lead">' + r.results[0].bio + '</p>');
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
										<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Employer name</th><th>Candidate supported</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
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
			}
		}); // end candidates case api/ + apiURL
	break;
	
    case "counties":
		$('#bycounty').addClass('active');
		var countyNameRaw = split[3];
		var countyStateRaw = split[5];
		
		//countyName = toTitleCase(countyName);
		 $.ajax({
			url: "api/counties/counties/" + countyNameRaw + "/states/" + countyStateRaw,
			dataType: "json",
			type : "GET",
			success : function(v) {
	
				var container = $("#main");
				
				introRow = $("<div></div>").appendTo(container);	
				introRow.addClass("row intro-row");
				
				var introLabel = $("<label>COUNTY/REGION</label>");
				introLabel.appendTo(introRow);
				
				var jumbotron = $("<div></div>").appendTo(introRow);
				jumbotron.addClass("jumbotron");
				
				var thinDivider = $("<div class='thin-divider'></div>");
				
				var countyName;
				var countyHead;
				var noContributions;
				
				// let's create an if/else statement for when a county has no contribution, but appears on map and is clickable
				if($.isEmptyObject(v.results)){
					countyName = countyNameRaw;
					
					countyHead = $("<h1>" + countyName + "</h1>");
					countyHead.appendTo(jumbotron);
					
					container.append(thinDivider);
					
					noContributions = $("<div class='row'><h2>There are no contributions from this county.</h2></div>");
					noContributions.appendTo(container);
					
				} else{
					countyName = toTitleCase(v.results[0].county);
					countyState = v.results[0].state;
					
					var countyHead = $("<h1>" + countyName + ", " + countyState + "</h1>");
					countyHead.appendTo(jumbotron);
					
					container.append(thinDivider);
					
					var mapAndTotals = $("<div class='row'></div>").appendTo(container);
					
					var countyState = v.results[0].state;
					var widthTotals = "";
					var mapSection;
					if (countyState != "PA"){
						widthTotals = "col-lg-12 col-md-12 col-sm-12";
					}else{
						widthTotals = "col-lg-7 col-md-7 col-sm-8";
						mapSection = $("<div class='col-lg-5 col-md-5 col-sm-4 col-xs-12'><svg id='map' style='width:100%; height:425px;'></svg></div>");
						mapSection.appendTo(mapAndTotals);
					};
					
					var totalsSection = $("<div></div>").appendTo(mapAndTotals);
					totalsSection.addClass(widthTotals + "top-totals");
					
					var totalsSectionTotals = $(" \
							<div class='row'> \
								<div class='col-lg-12 col-md-12 col-sm-12'> \
									<label>TOTAL CONTRIBUTIONS</label> \
									<h2 class='jumbo' id='totalcontributions'></h2> \
								</div> \
							</div> \
							<div class='thin-divider'></div> \
							<div class='row'> \
								<div class='col-lg-12 col-md-12 col-sm-12'> \
									<table class='horizontal-bar-graph' id='candidate-bar-table'></table> \
								</div> \
							</div> \
							<div class='thin-divider'></div> \
							<div class='row'> \
								<div id='county-percent-total' class='col-lg-6 col-md-6 col-sm-6 col-xs-6 block first big-number-with-wrapped-text'></div> \
								<div id='county-per-capita' class='col-lg-6 col-md-6 col-sm-6 col-xs-6 block big-number-with-wrapped-text' ></div> \
							</div>").appendTo(totalsSection);

					
					var candidateName = "";
					var candidateContribAmt = 0;
					var totalContribs = 0;
					var candidateContribNum = 0;
					var candidateStyle = "";
					var topTotalsCandidateRow;
					var candidateBarWidth;
					
					var candResults = v.results[0].beneficiaries;
					candResults.sort( function(a, b){ 
							return (b.amount - a.amount);
						});
						
					$.each(candResults, function(c, candidate){
						candidateName = candResults[c].name;
						candidateStyle = candResults[c].party;
						
						candidateContribAmtRaw = parseFloat(Math.round(candResults[c].amount));
						candidateContribAmt = candResults[c].amount;
						
						totalContribs += candidateContribAmtRaw;
						totalContribs = totalContribs;
						$('#totalcontributions').html(toDollars(totalContribs));
						
						candidateContribNum = candResults[c].contributions;
		
						if($.inArray(candidate.amount, candidate) == 0){
							candidateBarWidth = "100";
						}else{
							candidateBarWidth = (candResults[c].amount)/(candResults[0].amount) *100;
						};
						
						
						
						

													
						topTotalsCandidateRow = $("<tr><td><strong>" + candidateName + "</strong></td><td><div class='bar " + candidateStyle + "' style='width:" + candidateBarWidth +"%; color:#000000;'></div><span style='overflow:visible;'>" + toDollars(candidateContribAmt) + " (" + candidateContribNum + " contributions)" + "</span></td></tr>").appendTo("#candidate-bar-table");

						
						
					});					
					
					
					// get counties populations
					$.ajax({
						url: "http://api.usatoday.com/open/census/pop?keypat=" + countyNameRaw + "&keyname=placename&sumlevid=3&api_key=6vxwagz8yayp4t87ye7d2nf4",
						dataType: "jsonp",
						type : "GET",
						jsonp: "callback",
						success : function(USATdata) {
							
							var countyResults = USATdata.response;
							var countyPOP = "";
							$.each(countyResults, function(c, county){
								if (countyResults[c].StatePostal == countyState){
									countyPOPraw = countyResults[c].Pop;
									countyPOP = countyPOPraw.replace("county", "");
								}
							});
							console.log(countyPOP);
							
						
						
					
					
					
						$.ajax({
							url: "api/counties",
							dataType: "json",
							type : "GET",
							success : function(w) {
								var totalAllCountyDonations = 0; //total of all counties
								//totalContributions = total for THIS county
								
								for (var i = 0; i< w.results.length; i++) {
									totalAllCountyDonations += Math.round(parseFloat(w.results[i].amount));
								}
								var thisCountyPercent = totalContribs/totalAllCountyDonations*100;
								thisCountyPercent = thisCountyPercent.numberFormat(1);
								
								
								$("<h3>" + thisCountyPercent + "%</h3><label>" + countyName + " County represents " + thisCountyPercent + "% of total race contributions.</label>").appendTo("#county-percent-total");
								
								//per capita
								var perCapita = totalContribs/countyPOP;
								perCapita = "$" + perCapita.numberFormat(2);
								
								$("<h3>" + perCapita + "</h3><label>Contributions represent " + perCapita + " per capita in " + countyName + " County.</label>").appendTo("#county-per-capita")
								
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
							url: "api/contributors/counties/" + countyName + "/states/" + countyState + "?limit=25",
							dataType: "json",
							type : "GET",
							success : function(u) {
								$("#main").append(' \
								<div class = "row"> \
									<div class="col-lg-12 col-md-12 col-sm-12" id = "contributors"> \
										<h3>Contributors</h3> \
										<table class="table table-hover sortable"> \
											<thead> \
												<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Employer name</th><th>Candidate supported</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
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
										$.getJSON("/api/contributors/counties/" + countyName + "/states/" + countyState + "&limit=9999999&offset=25", function(data){
											appendRows(data, $("#contributors"), "contributors");
											$.bootstrapSortable(applyLast=true);
											$(".loading").remove();
										});
									});
								}
								$.bootstrapSortable();
							}
						});
						
						}
					});
				}//end if $.isEmptyObject statement
							
			}//end success
		}); // end counties case api/ + apiURL
	break;
	
	default:
	case "race":
		var race = split[3];
		var container = $("#main");
		var thinDivider = $("<div class='thin-divider'></div>");	
		$.getJSON("api/candidates", function(canData){
			var results = canData.results;

			var totalCandidateContrib = 0;
			var colWidth;
			var candidateBlock;
			
			// Set up two-column layout if two candidates;
			// otherwise, three-column
			if(results.length <= 2){
					colWidth = 6;
				}else{
					colWidth = 4;
				};
			
			var candidateVScandidate = $("<div class='row' id='candidate-vs-candidate'>")
			
			$.each( results, function(i, item) {
				candidateContrib = Math.round(parseFloat(results[i].total));
				totalCandidateContrib += candidateContrib;
				
				if (item.party == "DEM"){
					item.party = "Democrat";
				}else if (item.party == "REP"){
					item.party = "Republican"
				}
				candidateBlock = $("<div class='col-lg-" + colWidth + " col-md-" + colWidth + " col-sm-" + colWidth + " block'>");
				candidateImg = $("<a href = '/a/candidates/" + item.filerid + "'><div class='banner-image' id='candidateImg'></div></div>").appendTo(candidateBlock);
				candidateImg.children(".banner-image").attr("style", "background-image:url('../img/" + item.filerid + ".jpg'); background-size: cover; ");
				candidateName = $("<a href = '/a/candidates/" + item.filerid + "' style='color:inherit;'><h2><div style='text-decoration:underline; margin-right:5px; display:inline-block;'>" + item.name + "</div><small>" + item.party + "</small></h2></a>").appendTo(candidateBlock);
				candidateLabel = $("<label>Total contributed to " + item.name + "</label>").appendTo(candidateBlock);
				candidateTotal = $("<h2 class='jumbo'>" + toDollars(candidateContrib) + "</h2>").appendTo(candidateBlock);
				
				candidateBlock.appendTo(candidateVScandidate);			
			});
			
			var allCandidateContrib = toDollars(totalCandidateContrib);
			
			var projectIntro = $("<div class='row' id='project-intro'></div>").appendTo(container);
			
			var introText = $("\
			<div class='col-lg-5 col-md-5 col-sm-5 lead'> \
				<p>In politics, money is power. PublicSource and the Pittsburgh Post-Gazette believe you should know who's donating significant campaign cash to candidates for governor. So, we're following the money for you. Check back often for updates on who's contributing to the governor's race.</p>").appendTo(projectIntro);
			
			var totalContrib = $("<div class='col-lg-7 col-md-7 col-sm-7'></div>").appendTo(projectIntro);
			
			var totalContribAmt = $("<label>TOTAL CONTRIBUTIONS TO ALL CANDIDATES</label><h2 class='ultra-mega'>" + allCandidateContrib + "</h2>").appendTo(totalContrib);
			
			thinDivider.appendTo(container);
			
			candidateVScandidate.appendTo(container);
			
			thinDivider.appendTo(container);
			
			var mapTopChart = $("<div class='row' id='map-top-chart'>").appendTo(container);
			
			var candidateMap = $("<div class='col-lg-7 col-md-7 col-sm-7'><svg id='map' style = 'width:100%; height:465px;'></svg>\</div>").appendTo(mapTopChart);
			
			// Build top counties in PA table
			var countiesTable = $("<div class='col-lg-5 col-md-5 col-sm-5 tabular'>").appendTo(mapTopChart);
			var countiesTableLabel = $("<h3>Top contributions by county</h3>").appendTo(countiesTable);
			var countiesTableTable = $("<table class='table table-hover sortable'></table>").appendTo(countiesTable);
			var countiesTableHeader = $("<thead><tr><th>County</th><th>Total contributed</th><th>Majority contributed to</th></tr></thead>").appendTo(countiesTableTable);
			
			var countiesTableBody = $("<tbody></tbody>").appendTo(countiesTableTable);

			$.getJSON("/api/counties/states/PA", function(countyData){
				countyResults = countyData.results;
				var countyName = "";
			
				countyResults.sort( function(a, b){ 
					return (b.amount - a.amount);
				});
				
				$.each(countyResults, function(c, county){
					county.beneficiaries.sort(function(a,b){ return b.amount - a.amount; });
					countyName = "<tr><td><a href='/a/counties/" + county.county + "/states/" + county.state + "'>" + county.county + "</a></td><td>" + toDollars(county.amount) + "</td><td>" + county.beneficiaries[0].name + "</td></tr>";
					$(countyName).appendTo(countiesTableBody);
					if( c == 8) return false;
				});
				
				sizeToMatch($("#map"), countiesTable);
				drawCandidateMap("map");
			});
			
			$("<div class='thin-divider'></div>").appendTo(container);
			
			chartRow = $("<div class='row'></div>").appendTo(container);
			chartRow.append("<h3>Contributions over time</h3>");
			chartColumn = $("<div class='col-lg-12 col-md-12 col-sm-12'><div id = 'chart' style = 'width:100%; height:300px'></div>").appendTo(chartRow);
			makeCandidateTimeChart("chart", "2012-01-01", "2014-11-30");		
			
		}); // end case race getJSON api/candidates
	break;
		
	case "contributors":
	   var contribID = split[3];
	   $.getJSON("/api/contributors/" + contribID, function(data){
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
			headerAmt.after("<div class='thin-divider'></div>");
			
			var contribJob = data.results[0].occupation;
			var contribEmp = data.results[0].empName;
			
			
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
			var locationCounty = data.results[0].county;
			var locationZip = data.results[0].zip;
			var locationState = data.results[0].state;
			var topTotalsLeftLocationBlock = $("<div class='row'> \
													<div class='col-lg-12 col-md-12 col-sm-12'> \
														<label>LOCATION</label><h3>" + locationCity + ", " + locationState + "</h3> \
														<p><a href='/a/counties/" + locationCounty + "'>" + locationCounty + " County</a></p> \
													</div> \
												</div> \
												<div class='thin-divider'></div>"
												).appendTo(topTotalsLeft);
	   
			thinDivider.appendTo(topTotalsLeft);
	   
			//Top contributed block
			var topTotalsContrib = $("<div class='row'></div>").appendTo(topTotalsLeft);
			var topTotalsContribCol12 = $("<div class='col-lg-12 col-md-12 col-sm-12'></div>").appendTo(topTotalsContrib);
	   
			var contributionTotal = data.results[0].amount;
			var topTotalsContribLabel = $("<label>TOTAL CONTRIBUTED</label><h3>" + toDollars(contributionTotal) + "</h3>").appendTo(topTotalsContribCol12);
			
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
			var topTotalsCorbettRow = $("<tr><td><strong>Corbett</strong></td><td><div class='bar republican' style='width:" + corbettBarWidth +"%; color:#000000;'></div><span style='overflow:visible;'>" + toDollars(corbettContributionAmt) + " (" + parseInt(corbettContributionNum) + " contributions)" + "</span></td></tr>").appendTo(topTotalsContribCandidateTable);
			
			
			//Wolf row --> need to make graphic length respect amt donated
			var topTotalsWolfRow = $("<tr><td><strong>Wolf</strong></td><td><div class='bar democrat' style='width:" + wolfBarWidth + "%; color:#000000;'></div><span style='overflow:visible;'>" + toDollars(wolfContributionAmt) + " (" + parseInt(wolfContributionNum) + " contributions)" + "</span></td></tr>").appendTo(topTotalsContribCandidateTable);
			
			//Overtime
			var topTotalsOvertime = $("<div class='col-lg-5 col-md-5 col-sm-5 col-xs-12 block last'>").appendTo(topTotals);
			var topTotalsOvertimeGraph = $("<h3>Contributions over time</h3><div id='timechart' style='width:100%; height:400px'></div>").appendTo(topTotalsOvertime);
			
			// Map
			var topTotalsOvertime = $("<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12 block last'>").appendTo(topTotals);
			topTotalsOvertime.append("<h3>Location</h3>");
			topTotalsOvertime.append("<div id='map-canvas'></div>");
			
			// Size chart to equal neighboring column and activate chart
			sizeToMatch($("#timechart"), topTotalsLeft);
			makeTimeChart("timechart", "contributors", contribID, "2013-01-01", "2014-11-01");
			sizeToMatch($("#map-canvas"), topTotalsLeft);
			makeGoogleMap(locationCity, locationZip, "map-canvas");
			
			
			thinDivider.appendTo(container);
			
			container.append(thinDivider);
			
			container.append(' \
				<div class="row tabular"> \
					<div class="col-lg-12 col-md-12 col-sm-12"> \
						<h3>All donations by ' + contribName +'</h3> \
						<table class="table table-hover sortable"> \
							<thead> \
								<tr> \
									<th>Date</th>\
									<th>Candidate/PAC</th> \
									<th>Amount</th> \
								</tr> \
							</thead> \
							<tbody></tbody> \
						</table> \
					</div> \
				</div> ');
			
			//get contributor data
			$.getJSON("/api/contributions/contributors/" + contribID, function(data){
				
				$.each(data.results, function(i, result){
					$('.tabular tbody').append("<tr><td><a href='/a/contributions/" + result.id + "'>" + monthDayYear(result.date) + "</a></td><td>" + result.name + "</td><td>" + toDollars(result.contribution) + "</td></tr>");
				});
				$.bootstrapSortable(applyLast=true);
				pymChild.sendHeight();
			});	   
		});			
	break;
		
	case "contributions":
		$('#bycontributor').addClass('active');
		var contributionID = split[3];
       
		$.getJSON("/api/contributions/" + contributionID, function(data){
			var contribName = data.results[0].contributor;
			var contribID = data.results[0].contributorid;
			var contributionAmt = data.results[0].contribution;
			
			var conDateRaw = data.results[0].date;
			var filerID = data.results[0].filerid;
			
			$.getJSON("/api/contributors/" + contribID, function(data){
				 var locationCity = data.results[0].city;
				 var locationZip = data.results[0].zip;
				 var locationState = data.results[0].state;
				 locationZip = locationZip.substring(0,5);
				 var locationAddress = data.results[0].address;
				
					$.getJSON("/api/candidates/", function(data){
												
						var candidateName = "";
						var results = data.results;
						$.each(results, function(i, item){
							if(results[i].filerid == filerID){
								candidateName = results[i].name;
								candidateFilerID = results[i].filerid;
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
						
						var headerAmt = $("<h1>" + toDollars(contributionAmt) + "</h1>");
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
						
						contributionColumn = $("<div class='col-md-7 contrib-items block'></div>").appendTo(contributionRow);
						
						var h3 = "<h3></h3>";
						
						var contribItem = $(h3).appendTo(contributionColumn);
						contribItem.addClass("donor-item");
						var contribLabel = $("<strong>Contributor: </strong>").appendTo(contribItem);
						var contribLink = $("<a>" + contribName + "</a>").appendTo(contribItem);
						contribLink.attr("href", "/a/contributors/" + contribID);
						
						var candidateItem = $(h3).appendTo(contributionColumn);
						candidateItem.addClass("candidate-item");
						var candidateLabel = $("<strong>Candidate: </strong>").appendTo(candidateItem);
						var candidateLink = $("<a>" + candidateName + "</a>").appendTo(candidateItem);
						candidateLink.attr("href", "/a/candidates/" + candidateFilerID);
						
						var dateItem = $(h3).appendTo(contributionColumn);
						dateItem.addClass("date-item");
						var dateLabel = $("<strong>Date: </strong>").appendTo(dateItem);
						var dateData = $("<span>" + monthDayYear(conDateRaw) + "</span>").appendTo(dateItem);
						
						
						var locationItem = $(h3).appendTo(contributionColumn);
						locationItem.addClass("location-item");
						var locationLabel = $("<strong>Location: </strong>").appendTo(locationItem);
						var locationData = $("<span>" + locationCity + ", " + locationState + " " + locationZip + "</span>").appendTo(locationItem);
						
						mapColumn = $("<div class='col-lg-5 col-md-5 col-sm-5 block'></div>").appendTo(contributionRow);
						mapColumn.append("<div id='map-canvas' style='width:100%; border:1px solid lightgray; height:190px'></div>");
						
						makeGoogleMap(locationCity, locationZip, "map-canvas");
					
					});
				
				
				
			
			});
			
		});
	
	break;
   
	case "search":
		var content = $("#main");
		urlparameters = getURLParameters();
		// Start it off with dummy value so the rest can just start with &'s
		var parameters = "?";
		$.each(urlparameters, function(i, parameter){
			parameters += "&" + parameter.key + "=" + parameter.value;
		});
		// Contributions portion
		$.getJSON("/api/contributions/" + parameters + "&limit=25", function(data){
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
												<tr><th>Contributor</th><th>City</th><th>County</th><th>State</th><th>Employer</th><th>Candidate supported</th><th style="text-align:right" data-defaultsort="DESC">Total contributed</th></tr> \
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
}
 
	  
});
