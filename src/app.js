(function() {

	'use strict';

	angular.module('magicMirror', [
		'ngMessages',
		'ngAnimate',
		'ngAria',
		'ngMaterial',
		'ngRoute',
		'ngWebsocket',
		'magicMirrorPartials'
	]).config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'homeController',
			templateUrl:'partials/home.html'
		})
		.when('/detection', {
			controller: 'detectionController',
			templateUrl:'partials/detection.html'
		})
		.when('/recognition', {
			controller: 'recognitionController',
			templateUrl:'partials/recognition.html'
		})
		.when('/training', {
			controller: 'trainingController',
			templateUrl:'partials/training.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);

})();