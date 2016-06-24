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

angular.module('app').controller('ctrl', ['$scope', '$http', '$interval', 'Constant', function($scope, $http, $interval, Constant){

  var interval = $interval(function(){
    if(map !== null){
      initMap();
      $interval.cancel(interval);
    }
  });

  function initMap(){

    map.setCenter(new google.maps.LatLng(Constant.initialPosition.Lat, Constant.initialPosition.Lng));

    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: false
    })

    drawingManager.setMap(map);

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('legend'));

    google.maps.event.addListener(drawingManager, 'polylinecomplete', function(polyline) {
      var polys = [];
      polyline.getPath().forEach(function(poly){
        polys.push({ lat: poly.lat(), lng: poly.lng() })
      });

      $http.post('/router', {
        mac: 'Novo roteador',
        polygons: polys
      }).success(function(data){
        $scope.routers.push(data.data);
        $scope.printRouter();
        polyline.setMap(null);
        $scope.modalRouter = true;
      });

    });

    $scope.printRouter();
  };

  angular.extend($scope, {
    modal: false,
    areas: [],
    routers: [],
    modalEditArea: null,
    modalEditRouter: null
  });

  $http.get('/area').success(function(data){
    $scope.areas = data.data;
  });

  $http.get('/router').success(function(data){
    $scope.routers = data.data;
    if(map !== null) $scope.printRouter();
  });

  $scope.cancelArea = function(){
    $scope.modalArea = false;
  };

  $scope.cancelRouter = function(){
    $scope.modalRouter = false;
  };

	$scope.reload = function(){
		window.location.reload();
	};

  $scope.getAreas = function(){
    $scope.modalArea = true;
  };

  $scope.getRouters = function(){
    $scope.modalRouter = true;
  };

  $scope.editArea = function(item){
    $scope.modalEditArea = item;
  };

  $scope.editRouter = function(item){
    $scope.modalEditRouter = item;
  };

  $scope.searchRouter = function(item){
    var bounds = new google.maps.LatLngBounds();
    item.polygons.forEach(function(polygon){
      bounds.extend(new google.maps.LatLng(polygon.lat, polygon.lng));
    });
    map.setCenter(bounds.getCenter());
    $scope.cancel();
  };

  $scope.updateArea = function(item){
    $scope.modalEditArea = null;
    $http.post('/area/update', {
      _id: item._id,
      description: item.description
    });
  };

  $scope.newArea = function(){
    $scope.modalEditArea = null;
    $http.post('/area', {
      description: 'Nova área'
    }).success(function(data){
      $scope.areas.push(data.data);
      $scope.modalArea = true;
    });
  };

  $scope.updateRouter = function(item){
    $scope.modalEditRouter = null;
    $http.post('/router/update', {
      _id: item._id,
      color: item.color,
      areaId: item.areaId,
      mac: item.mac
    }).success(function(){
      $scope.printRouter();
    });
  };

  $scope.deleteArea = function(item, index){
    $scope.modalEditArea = null;
    $http.delete('/area/' + item._id).success(function(){
      item._polygons.setMap(null);
      $scope.areas.splice(index, 1);
    });
  };

  $scope.deleteRouter = function(item, index){
    $scope.modalEditRouter = null;
    $http.delete('/router/' + item._id).success(function(){
      item._polygons.setMap(null);
      $scope.routers.splice(index, 1);
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
    });
  };

}])