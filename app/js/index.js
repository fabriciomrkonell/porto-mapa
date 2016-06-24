'use strict';

var map = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    mapTypeControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false
  });
};

angular.module('app').controller('ctrl', ['$scope', '$interval', '$http', 'Constant', function($scope, $interval, $http, Constant){

  var interval = $interval(function(){
    if(map !== null){
      initMap();
      $interval.cancel(interval);
    }
  });

	function initMap(){
		map.setCenter(new google.maps.LatLng(Constant.initialPosition.Lat, Constant.initialPosition.Lng));
	  $scope.printRouter();
	};

	angular.extend($scope, {
		routers: []
	});

	$http.get('/router').success(function(data){
    $scope.routers = data.data;
    if(map !== null) $scope.printRouter();
  });

  $scope.writeText = function(polygons){
    var bounds = new google.maps.LatLngBounds();
    polygons.forEach(function(polygon){
      bounds.extend(new google.maps.LatLng(polygon.lat, polygon.lng));
    });
    var marker = new google.maps.Marker({
      position: bounds.getCenter(),
      label: 'dasddasdasa',
      map: map
    });
  };

  $scope.printRouter = function(){
    $scope.routers.forEach(function(item, key){
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
      $scope.writeText(item.polygons);
    });
  };
}])