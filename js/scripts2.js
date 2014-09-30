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
			url: "api/candidates/2009216",
			dataType: "json",
			type : "GET",
			success : function(r) {
			  console.log(r);
			  console.log(r.results[0]);
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