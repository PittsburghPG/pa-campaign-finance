var map;
$(document).ready(function() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(40.4450813, -80.00877459999998),
	disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);

  //parse url
  var pathname = window.location.pathname;
  console.log(pathname);
	  
});