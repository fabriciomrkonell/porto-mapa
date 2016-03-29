'use strict';

var map = null,
		center = null;

function initMap() {
	center = new google.maps.LatLng(-28.2280632, -48.6567348);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    zoomControl: true,
	  mapTypeControl: false,
	  scaleControl: false,
	  streetViewControl: false,
	  rotateControl: false
  });
};

angular.module('app').controller('ctrl', ['$scope', '$interval', function($scope, $interval){

	var interval = $interval(function(){
		if(map !== null){
			initMap();
			$interval.cancel(interval);
		}
	});

	function initMap(){
		new google.maps.Polygon({
	    paths: [
				{ lat: -28.232395907333476, lng: -48.651612997055054 },
				{ lat: -28.23148846423027, lng: -48.650368452072144 },
				{ lat: -28.23479681332551, lng: -48.64562630653381 },
				{ lat: -28.23479681332551, lng: -48.645851612091064 },
				{ lat: -28.23466448133108, lng: -48.64623785018921 },
				{ lat: -28.234626672159695, lng: -48.64662408828735 },
				{ lat: -28.234645576747063, lng: -48.64703178405762 },
				{ lat: -28.23465502903949, lng: -48.647342920303345 },
				{ lat: -28.234768456483383, lng: -48.64765405654907 },
				{ lat: -28.235023667791246, lng: -48.64772915840149 },
				{ lat: -28.23525052177466, lng: -48.64771842956543 },
				{ lat: -28.23544901861452, lng: -48.64768624305725 },
				{ lat: -28.235713680493205, lng: -48.64769697189331 },
				{ lat: -28.235874367742127, lng: -48.647825717926025 },
				{ lat: -28.232395907333476, lng: -48.651612997055054 }
			],
	    strokeColor: '#FF0000',
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: '#FF0000',
	    fillOpacity: 0.35
	  }).setMap(map);

		$scope.markers['1'] = new google.maps.Marker({
	    position: map.getCenter(),
	    icon: {
	      path: google.maps.SymbolPath.CIRCLE,
	      scale: 4
	    },
	    draggable: false,
	    map: map
	  });

	};

	angular.extend($scope, {
		markers: {}
	});

	$scope.starLocalize = function(latlng){
		map.setCenter(latlng);
		map.setZoom(19);
	};

	$scope.stopLocalize = function(){
		map.setCenter(center);
		map.setZoom(15);
	};

	$interval(function(){
		for(var key in $scope.markers){
			var pos = $scope.markers[key].position,
					latlng = new google.maps.LatLng(pos.lat() + 0.0001, pos.lng() + 0.0001)
    	$scope.markers[key].setPosition(latlng);
    	$scope.starLocalize(latlng);
		};
	}, 1000);

}])