'use strict';

var map = null,
		center = null,
		socket = io();

function initMap() {
	center = new google.maps.LatLng(-28.232798907333476, -48.650000997055054);
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

angular.module('app').controller('ctrl', ['$scope', '$interval', '$http', function($scope, $interval, $http){

	var interval = $interval(function(){
		if(map !== null){
			initMap();
			$interval.cancel(interval);
		}
	});

	function initMap(){

		map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById('panel'));

		$scope.markers['1'] = new google.maps.Marker({
	    position: map.getCenter(),
	    icon: {
	      path: google.maps.SymbolPath.CIRCLE,
	      scale: 4
	    },
	    draggable: false,
	    map: map
	  });

	  $scope.printArea();
	};

	function isAreaAlert(latlng){
		var exit = false;
		$scope.areas.forEach(function(item){
			console.log(google.maps.geometry.poly.containsLocation(latlng, item._polygons))
			if(google.maps.geometry.poly.containsLocation(latlng, item._polygons)) return false;
			exit = true;
		});
		return exit;
	};

	angular.extend($scope, {
		markers: {},
		areas: []
	});

	$http.get('/area').success(function(data){
		var areas = [];
		data.data.forEach(function(item){
			if(item.active === false) return false;
			areas.push(item);
		});
    $scope.areas = areas;
    if(map !== null) $scope.printArea();
  });

  $scope.printArea = function(){
    $scope.areas.forEach(function(item, key){
      if(item._polygons) item._polygons.setMap(null);
      item._polygons = new google.maps.Polygon({
        paths: item.polygons,
        strokeColor: item.color,
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: item.color,
        fillOpacity: 0.35
      });
      item._polygons.setMap(map);
    });
  };

	$scope.starLocalize = function(latlng){
		map.setCenter(latlng);
		map.setZoom(19);
	};

	$scope.stopLocalize = function(){
		map.setCenter(center);
		map.setZoom(15);
	};

  socket.on('news', function (data) {
		var pos = $scope.markers[data.key].position,
				latlng = new google.maps.LatLng(pos.lat() + 0.0001, pos.lng() + 0.0001)
  	$scope.markers[data.key].setPosition(latlng);
  	if(isAreaAlert(latlng)){
  		$scope.starLocalize(latlng);
  	}
  });

}])