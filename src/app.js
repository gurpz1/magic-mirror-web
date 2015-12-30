(function() {

	'use strict';

	angular.module('magicMirror', [
		'ngMessages',
		'ngAnimate',
		'ngAria',
		'ngMaterial',
		'ngRoute',
		'magicMirrorPartials'
	]).config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'HomeController',
			templateUrl:'partials/home.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);

})();