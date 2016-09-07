'use strict';

var map = null, socket = io(), me = this;

angular.module('app', []);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});

angular.module('app').controller('ctrl', [function(){

  var __width = 500, __height = 500;

  var itens = [{
    mac: 1,
    __top: 320,
    __left: 450,
    radius: 20,
    fill: 'green'
  }, {
    mac: 2,
    __top: 120,
    __left: 80,
    radius: 20,
    fill: 'red'
  }];

  var canvas = null;

  function rezise() {
    var size = getSize(), map = document.getElementById('map');
    if(canvas === null) canvas = me.__canvas = new fabric.Canvas('map'), start();
    map.style.width = size.width + 'px';
    map.style.height = size.height + 'px';
    map.width = size.width;
    map.height = size.height;
    update(size);
    canvas.renderAll();
  };

  function getSize() {
    return {
      width: window.innerWidth || document.body.clientWidth,
      height: window.innerHeight || document.body.clientHeight
    }
  };

  function update(size) {
    canvas.getObjects().map(function(item) {
      var circle = item.item(0);
      var width = (circle.__left / __width) * size.width;
      var height = (circle.__top / __height) * size.height;
      item.left = width;
      item.top = height;
    });
  };

  function start(){
    itens.forEach(function(item) {
      item.text = new fabric.Text('0', {
        fontSize: 30,
        fill: 'white',
        left: 13,
        top: 3
      });
      canvas.add(new fabric.Group([ new fabric.Circle({
        __top: item.__top,
        __left: item.__left,
        radius: 20,
        fill: item.fill
      }), item.text ]));
    });
  };

  window.onresize = function(event) {
    rezise();
  };

  rezise();

  socket.on('news', function(data) {
    itens.forEach(function(item, key){
      item.text.setText(data[item.mac] === undefined ? '0' : data[item.mac].badges.length.toString());
    });
    canvas.renderAll();
  });

}])