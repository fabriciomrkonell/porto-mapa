'use strict';

angular.module('app', []);

angular.module('app').constant('Constant', {
	addressData: '190.109.109.10:3000',
	initialPosition: {
		Lat: -28.2325000,
		Lng: -48.6524000
	}
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});