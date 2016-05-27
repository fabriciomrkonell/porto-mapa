'use strict';

angular.module('app', []);

angular.module('app').constant('Constant', {
	addressData: '190.109.109.10:3000',
	initialPosition: {
		Lat: -26.467816,
		Lng: -49.113897
	}
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});