'use strict';

var map = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: new google.maps.LatLng(-28.2280632, -48.6567348),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    zoomControl: true,
	  mapTypeControl: false,
	  scaleControl: false,
	  streetViewControl: false,
	  rotateControl: false
  });

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: false
  })

  drawingManager.setMap(map);

	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('legend'));

	google.maps.event.addListener(drawingManager, 'polylinecomplete', function(polyline) {
  	polyline.getPath().forEach(function(poly){
  		console.log("{ lat: " + poly.lat() + ", lng: " + poly.lng() + " }");
  	});
	});

};

angular.module('app').controller('ctrl', ['$scope', function($scope){

	$scope.save = function(){
		alert('save');
	};

}])