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
			  console.log(r.results[0]);
			  $('.intro-row label').html('CANDIDATE');
			  var name = r.results[0].name;
			  var party = r.results[0].party;
			  if (party == 'REP') { party = "Republican";}
			  if (party == 'DEM') { party = "Democratic";}
			  var total = r.results[0].total;
			  $('.jumbotron h1').html(name);
			  var n = name.split(" ");
			  var lastName = n[1];
			  lastName = lastName.toLowerCase();
			  $( "<div class='banner-image'></div>" ).insertAfter( "#intro-row" );
			  $('.banner-image').css('background-image', "url('/../img/" + lastName + "-header.jpg')");
			  $('.banner-image').css('background-size', 'cover');
			  $( "<div class='container' id='data'></div>" ).insertAfter( ".banner-image" );
			  $('#data').append("<div class='row thick-divider' id='bio_totals'></div>");
			  $('#bio_totals').append("<div id='bio' class='col-lg-5 col-md-5 col-sm-5 col-xs-12'></div>");
			  $('#bio').append('<p><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-birthday-cake fa-stack-1x fa-inverse"></i></span><strong id="party"></strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-phone fa-stack-1x fa-inverse"></i></span><strong id="phone">phone</strong><br><span class="fa-stack fa-md"><i class="fa fa-square fa-stack-2x"></i>	<i class="fa fa-envelope fa-stack-1x fa-inverse"></i></span><strong id="address">address</strong><br></p><p class="lead">Tom Corbett! What a bro. This is some text about his biography. Not more than three lines. </p>');
			  $('#party').html(party);
			  
			  $('#bio_totals').append('<div class="col-lg-6 col-md-6 col-sm-7 col-lg-offset-1 col-md-offset-1 top-totals"><div class="row no-margin-top"><div class="col-lg-12 col-md-12 col-sm-12"><label>TOTAL RAISED</label>		<h2 class="jumbo" id="total_raised"></h2></div></div><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block first"><label>$50 AND OVER</label><h3>$3,456,223</h3></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block"><label>UNDER $50</label><h3>$1,543,776</h3></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 block last"><label>MEDIAN DONATION</label><h3>$200</h3></div></div></div>');
			  
			  if (total/1000000 > 0) {
				var newTotal = total.toString()
			  }
			 
			  $('#total_raised').html('$' + newTotal);
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