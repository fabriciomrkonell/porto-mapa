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
};

angular.module('app').controller('ctrl', ['$scope', '$http', '$interval', function($scope, $http, $interval){

  var interval = $interval(function(){
    if(map !== null){
      initMap();
      $interval.cancel(interval);
    }
  });

  function initMap(){
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

      $http.post('/area', {
        description: 'Nova área',
        polygons: polys
      }).success(function(data){
        $scope.areas.push(data.data);
        $scope.printArea();
        polyline.setMap(null);
        $scope.modal = true;
      });
    });

    $scope.printArea();
  };

  angular.extend($scope, {
    modal: false,
    areas: [],
    modalEdit: null
  });

  $http.get('/area').success(function(data){
    $scope.areas = data.data;
    if(map !== null) $scope.printArea();
  });

  $scope.cancel = function(){
    $scope.modal = false;
  };

	$scope.reload = function(){
		window.location.reload();
	};

  $scope.getAreas = function(){
    $scope.modal = true;
  };

  $scope.editArea = function(item){
    $scope.modalEdit = item;
  };

  $scope.updateArea = function(item){
    $scope.modalEdit = null;
    $http.post('/area/update', {
      _id: item._id,
      color: item.color,
      description: item.description,
      active: item.active,
      visible: item.visible
    }).success(function(){
      $scope.printArea();
    });
  };

  $scope.deleteArea = function(item, index){
    $scope.modalEdit = null;
    $http.delete('/area/' + item._id).success(function(){
      item._polygons.setMap(null);
      $scope.areas.splice(index, 1);
    });
  };

  $scope.printArea = function(){
    $scope.areas.forEach(function(item, key){
      if(item._polygons) item._polygons.setMap(null);
      if(item.visible === false) return false;
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