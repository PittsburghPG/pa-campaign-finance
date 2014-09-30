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
    case "candidate":
        $('#bycandidate').addClass('active'); //make the dropdown menu active on the correct item
		
		
		var candName = decodeURIComponent(split[3]); //grab the candidate name from the url
		console.log(toTitleCase(candName));
        
		
		
		
		
		
		
		
		
		break;
    case "county":
      $('#bycounty').addClass('active');
	  var countyName = split[3];
        break;
	case "contributor":
       $('#bycontributor').addClass('active');
	   var contributorName = split[3];
        break;
	case "contribution":
		console.log("working on contribution!");
		console.log("second bit of work");
         $('#bycontributor').addClass('active');
		  var contributionID = split[3];
        break;
    default:
        //default //code block
}
 
	  
});

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}