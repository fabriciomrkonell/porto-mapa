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

  new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: false
  }).setMap(map);

	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('legend'));
};

angular.module('app').controller('ctrl', ['$scope', function($scope){

	$scope.save = function(){
		alert('s');
	};

}])