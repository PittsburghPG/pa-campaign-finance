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
 var apiURL = split[2] + "/" + split[3];
 //console.log(apiURL);
 //case statement
 switch(split[2]) { //the second item in the array will be the type of page this will be
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
			  //console.log(r);
			  //console.log(r.results[0]);
			  var name = r.results[0].name;
			  var party = r.results[0].party;
			  //console.log(party);
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
			//thinDivider.appendTo(jumbotron);
			  
			 
			 //banner image
			  var n = name.split(" ");
			  var lastName = n[1];
			  lastName = lastName.toLowerCase();
			 // $( "<div class='banner-image'></div>" ).appendTo('body');
			 $( "<div class='banner-image'></div>" ).insertAfter( "#main" );
			  $('.banner-image').css('background-image', "url('/../img/" + lastName + "-header.jpg')");
			  $('.banner-image').css('background-size', 'cover');
			  
			  //bio information
			  $( "<div class='container' id='data'></div>" ).insertAfter( ".banner-image" );
			// $( "<div class='container' id='data'></div>" ).insertAfter( "#main" );
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
			  //flTotal = flTotal.toLocaleString();
			  flTotal = flTotal.numberFormat(0);
			  $('#total_raised').html('$' + flTotal);
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
				
				$("<div class='container'><div class='thin-divider' id='datadivider'></div></div>").insertAfter("#data");
				
				//charts 
				//container.append('<div class="row graphs"><div class="col-lg-8 col-md-8 col-sm-8 block"><h3>County-by-county contributions <i class="fa fa-info-circle"></i></h3><div class="well"><img src="/../img/pa-heat-map.png" alt="County-by-county contribution" /></div></div><div class="col-lg-4 col-md-4 col-sm-4"><h3>Over time</h3><div class="well" id="timechart" style="width: 100%; height: 200px;"></div><h3>In state vs. out of state</h3><div class="well" id="pie" style="width: 100%; height: 200px;"></div></div></div>');
				$('<div class="container" id="charts"><div class="row graphs"><div class="col-lg-8 col-md-8 col-sm-8 block"><h3>County-by-county contributions <i class="fa fa-info-circle"></i></h3><div class="well"><img src="/../img/pa-heat-map.png" alt="County-by-county contribution" /></div></div><div class="col-lg-4 col-md-4 col-sm-4"><h3>Over time</h3><div class="well" id="timechart" style="width: 100%; height: 200px;"></div><h3>In state vs. out of state</h3><div class="well" id="pie" style="width: 100%; height: 200px;"></div></div></div></div><div class="thin-divider"></div>').insertAfter( "#datadivider" );
				makePieChart("pie", split[3], "PA");
				makeTimeChart("timechart", "candidates", split[3], "2013-01-01", "2014-09-01");
				
				//$("<div class='thin-divider' id='chartdivider'></div>").insertAfter("#charts");
				$("<div class='container'><div class='thin-divider' id='chartdivider'></div></div>").insertAfter("#charts");
				
				//tabular data
				$('<div class="container" id="table"><div class="row tabular" id="tableHeightDiv" style="margin-bottom: 30px;"><div class="col-lg-12 col-md-12 col-sm-12"><h3>Donors</h3><form class="form-inline pull-right"><input type="search" class="form-control" placeholder="Search"><button type="submit" class="btn btn-default">Submit</button></form><table class="table table-hover sortable" id="donorTable"><thead><tr><th>Donor</th> <th>Occupation, Employer</th><th>Amount</th></tr></thead><tbody></tbody></table></div></div></div> ').insertAfter("#chartdivider");
				var donorHeight = $("#tableHeightDiv").height();
				$("#tableHeightDiv").css({'height': '500px', 'overflow':'hidden'});
				//container.append(thinDivider);
				//get contributor data
				$.ajax({
					url: "api/contributors/filers/" + split[3],
					dataType: "json",
					type : "GET",
					success : function(u) {
						//console.log(u.results[0].contributor);
						//console.log(u.results.length);
						var line;
						for(var i =0; i < u.results.length; i++) {
							var emp;
							if (u.results[i].occupation == '') { //don't show comma if there's no occupation
								emp = u.results[i].empName;
							} else {
								emp = u.results[i].occupation;
								if (u.results[i].empName != '') {
									emp += ", " + u.results[i].empName;
								}
							}
							var amount = parseInt(u.results[i].amount);
							amount = amount.numberFormat(0);
							line = "<tr><td><a href='/a/contributors/" + u.results[i].contributorid + "'>" + u.results[i].contributor + "</a></td><td>" +  emp  + "</td><td align='right'>$" + amount + "</td></tr>";
							//console.log(line);
							$('#donorTable tbody').append(line);
						}
					}
			    });
				
				$('<div class="container"><a href="">View all</a></div>').insertAfter('#table');
			}
		  });
		 
        break;
    case "counties":
      $('#bycounty').addClass('active');
	  var countyName = split[3];
	  //console.log(countyName);
	  countyName = toTitleCase(countyName);
	  $.ajax({
			url: "api/" + apiURL,
			dataType: "json",
			type : "GET",
			success : function(v) {
				//console.log(v.results[0]);
				var container = $("#main");
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
				
				container.append('<div class="row "><div class="col-lg-5 col-md-5 col-sm-4 col-xs-12"><img src="img/allegheny-co.png" alt="Allegheny County map" /></div><div class="col-lg-7 col-md-7 col-sm-8 top-totals">	<div class="row"><div class="col-lg-12 col-md-12 col-sm-12"><label>TOTAL CONTRIBUTIONS</label><h2 class="jumbo">$26.2 million</h2></div></div><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block first"><h3>88%</h3><label>Allegheny County represents 88% of total race contributions.</label></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block"><h3>12 cents</h3><label>Contributions represent 12 cents per capita in Allegheny County.</label></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block last"><label><strong>Corbett:</strong> $13.1 million <br>(75 donations)<br><br><strong>Wolfe:</strong> $13.1 million <br>(75 donations)</label></div></div></div></div>')
			}
	  });
	  
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
}
 
	  
});

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