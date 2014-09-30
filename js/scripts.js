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
	
	
	case "contributors":
       $('#bycontributor').addClass('active');
	   var contribName = split[3];
	   
	   $.getJSON("/api/contributors/" + contribName, function(data){
	   
		   	//intro row
				var container = $("#main");
				introRow = $("<div></div>").appendTo(container);	
				introRow.addClass("row intro-row");
				
				var introLabel = $("<label>CONTRIBUTOR</label>");
				introLabel.appendTo(introRow);
				
				var jumbotron = $("<div></div>").appendTo(introRow);
				jumbotron.addClass("jumbotron");
				
				var headerAmt = $("<h1>" + contribName + "</h1>");
				headerAmt.appendTo(jumbotron);
				
				var contribJob = data.results[0].occupation;
				var contribEmp = data.results[0].empName;
				
				console.log(contribJob.length);
				
				var contribTitle = $("<small>" + contribJob + ", " + contribEmp + "</small>");
				//var contribTitle = "";
				//if((contribJob.length > 0) && (contribEmp.length > 0)){
					//contribTitle = "<small>" + contribJob + ", " + contribEmp + "</small>";
				//}
				//elseif ((contribJob.length > 0) && (contribEmp.length == 0)){
					//contribTitle = "<small>" + contribJob + "</small>";
				//}
				//elseif ((contribJob.length == 0) && (contribEmp.length > 0)){
					//contribTitle = ", <small>" + contribEmp + "</small>"; 
				//}
				//else {
					//contribTitle = "";
				//};
				contribTitle.appendTo(headerAmt);
				
				var thinDivider = $("<div class='thin-divider'></div>");
				thinDivider.appendTo(jumbotron);
	   
	   
	   

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
						var dateData = $("<span>" + contributionDate + "</span>").appendTo(dateItem);
						
						
						var locationItem = $(h3).appendTo(contributionColumn);
						locationItem.addClass("location-item");
						var locationLabel = $("<strong>Location: </strong>").appendTo(locationItem);
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