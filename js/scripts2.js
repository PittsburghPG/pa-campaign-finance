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
			thinDivider.appendTo(jumbotron);
			  
			 
			 //banner image
			  var n = name.split(" ");
			  var lastName = n[1];
			  lastName = lastName.toLowerCase();
			  $( "<div class='banner-image'></div>" ).appendTo(container);
			  $('.banner-image').css('background-image', "url('/../img/" + lastName + "-header.jpg')");
			  $('.banner-image').css('background-size', 'cover');
			  
			  //bio information
			  $( "<div class='container' id='data'></div>" ).insertAfter( ".banner-image" );
			  $('#data').append("<div class='row' id='bio_totals'></div>");
			  $('#bio_totals').append("<div id='bio' class='col-lg-5 col-md-5 col-sm-5 col-xs-12'></div>");
			  $('#bio').append('<p><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-birthday-cake fa-stack-1x fa-inverse"></i></span><strong id="party"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-phone fa-stack-1x fa-inverse"></i></span><strong id="phone"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i>	<i class="fa fa-envelope fa-stack-1x fa-inverse"></i></span><strong id="address"></strong><br></p><p class="lead">Tom Corbett! What a bro. </p>');
			  $('#party').html(party);
			  $('#address').html(address1 + address2 + ", " + city + ", " + state + " " + zip);
			  $('#phone').html(phone);
			  
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
				
				container.append(thinDivider);
				//charts would go here
				
				//tabular data
				container.append(thinDivider);
				
				container.append('<div class="row tabular"  style="height: 500px; overflow: hidden; margin-bottom: 30px;"><div class="col-lg-12 col-md-12 col-sm-12"><h3>Donors</h3><form class="form-inline pull-right"><input type="search" class="form-control" placeholder="Search"><button type="submit" class="btn btn-default">Submit</button></form><table class="table table-hover sortable"><thead><tr><th>Donor</th> <th>Occupation, Employer</th><th>Amount</th></tr></thead><tbody></tbody></table></div></div> ');
				
				container.append(thinDivider);
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
							$('tbody').append(line);
						}
					}
			    });
				
			}
		  });
		 
        break;
    case "counties":
      $('#bycounty').addClass('active');
	  var countyName = split[3];
        break;
	case "contributors":
       $('#bycontributor').addClass('active');
	   var contributorName = split[3];
        break;
	case "contributions":
         $('#bycontributor').addClass('active');
		  var contributionID = split[3];
         
			$.getJSON("/api/contributions/" + contributionID, function(data){
				var contributorName = data.results[0].contributor;
				
				var conDateRaw = data.results[0].date;
				var d = new Date(conDateRaw);
				var con_date = d.getDate(conDateRaw);
				var con_month = d.getMonth(conDateRaw);
				var con_year = d.getFullYear(conDateRaw);
				var contributionDate = con_month + "/" + con_date + "/" + con_year;
				
				var filerID = data.results[0].filerid;
				$.getJSON("/api/candidates/", function(data){
					var candidateName = data.results[0].name;
					console.log("Contribution by " + contributorName + " on " + contributionDate + " to " + candidateName);
					
				});
				
				
				var donationStats = [];
				$.each(data.results[0], function(key, val) {
					donationStats.push( "<h3><strong>" + key + "</strong> <a href=''><strong>" + val + "</strong></a></h3>");
				});
				
			});
		
		
		
		
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