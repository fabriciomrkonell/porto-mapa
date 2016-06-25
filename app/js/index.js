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

initMap();

angular.module('app').controller('ctrl', ['$scope', '$interval', '$http', 'Constant', function($scope, $interval, $http, Constant){

  var interval = $interval(function(){
    if(map !== null){
      initMap();
      $interval.cancel(interval);
    }
  });

  setInterval(function(){
    $scope.routers.forEach(function(item, key){
      item._marker.set('text', Math.floor(Math.random() * 100));
    });
  }, 5000);

	function initMap(){
		map.setCenter(new google.maps.LatLng(Constant.initialPosition.Lat, Constant.initialPosition.Lng));
	  $scope.printRouter();
	};

	angular.extend($scope, {
		routers: [],
    modalRouterObject: null,
    modalRouter: false
	});

	$http.get('/router').success(function(data){
    $scope.routers = data.data;
    if(map !== null) $scope.printRouter();
  });

  $scope.cancelRouter = function(){
    $scope.modalRouter = false;
    $scope.modalRouterObject = null;
  };

  $scope.writeText = function(item){
    var bounds = new google.maps.LatLngBounds();
    item.polygons.forEach(function(polygon){
      bounds.extend(new google.maps.LatLng(polygon.lat, polygon.lng));
    });
    item._marker = new MapLabel({
      text: '',
      position: bounds.getCenter(),
      map: map,
      fontSize: 20,
      strokeColor: '#FFF',
      strokeWeight: 0,
      fontColor: '#FFF'
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
      item._polygons.addListener('click', function() {
        $scope.modalRouterObject = {
          mac: item.mac
        };
        $scope.modalRouter = true;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      });
      $scope.writeText(item);
    });
  };
}])