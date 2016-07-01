'use strict';

var map = null,
    socket = io();

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

	function initMap(){
		map.setCenter(new google.maps.LatLng(Constant.initialPosition.Lat, Constant.initialPosition.Lng));
	  $scope.printRouter();
	};

	angular.extend($scope, {
    localizations: [],
    badges: [],
		routers: [],
    modalRouterObject: null,
    modalUserObject: null,
    modalRouter: false,
    modalUser: false
	});

	$http.get('/router').success(function(data){
    $scope.routers = data.data;
    if(map !== null) $scope.printRouter();
  });

  $scope.getUser = function(id){
    $scope.modalUser = true;
    $scope.modalRouter = false;
    $http.get('/badge/' + id).success(function(data){
      $scope.modalUserObject = data.data;
    });
  };

  $scope.cancelRouter = function(){
    $scope.modalRouter = false;
    $scope.modalRouterObject = null;
  };

  $scope.getBadges = function(mac){
    var badges = $scope.localizations[mac] === undefined ? [] : $scope.localizations[mac].badges;
    $scope.modalRouterObject = { mac: mac, badges: [] };
    $http.post('/badge', { badges: badges }).success(function(data){
      $scope.modalRouterObject.badges = data.data;
    });
  };

  $scope.cancelUser = function(){
    $scope.modalUser = false;
    $scope.modalUserObject = null;
    $scope.modalRouter = true;
  };

  $scope.writeText = function(item){
    var bounds = new google.maps.LatLngBounds();
    item.polygons.forEach(function(polygon){
      bounds.extend(new google.maps.LatLng(polygon.lat, polygon.lng));
    });
    item._marker = new LabelOverlay({
      ll: bounds.getCenter(),
      label: '0',
      map: map
    });
  };

  $scope.printRouter = function(){
    $scope.routers.forEach(function(item, key){
      if(item._polygons) item._polygons.setMap(null);
      if(item._marker) item._marker.setMap(null);
      item._polygons = new google.maps.Polygon({
        paths: item.polygons,
        strokeColor: item.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: item.color,
        fillOpacity: 0.35,
        zIndex: 0
      });
      item._polygons.setMap(map);
      item._polygons.addListener('click', function() {
        $scope.getBadges(item.mac);
        $scope.modalRouter = true;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      });
      $scope.writeText(item);
    });
  };

  socket.on('news', function(data) {
    $scope.localizations = data;
    $scope.routers.forEach(function(item, key){
      item._marker.setLabel(data[item.mac] === undefined ? '0' : data[item.mac].badges.length.toString());
    });
  });

}])