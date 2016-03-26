(function() {
	'use strict';

	angular.module('magicMirror')
	.controller('HomeController', [
		'$scope',
		'$mdToast',
		'$window',
		'$interval',
		'$log',
		'$http',
		function($scope, $mdToast, $window, $interval, $log, $http) {

			var nav = $window.navigator;
			var video = document.getElementById('liveVideo');
			var canvas = document.getElementById('overlay');
			var ctx = canvas.getContext('2d');

			var ws = new WebSocket("ws://localhost:8080/findFaces");
			var cf = new WebSocket("ws://localhost:8080/countFaces");

			cf.onopen = function() {
				$log.debug("Opened connection to countfaces");
				$interval(function(video, ctx) {
					var blob = Util.dataURLToBlob(canvas.toDataURL());
					cf.send(blob);
				}, 1000, 0, true, video, ctx);
			};

			cf.onmessage = function(message) {
	    	$log.debug("countFaces message received");
	    	$log.info(message.data);
			};

	    ws.onopen = function () {
				$log.debug("Opened connection to findFaces");
				// Capture the image from the video
				$interval(function(video, ctx) {
					ctx.drawImage(video,0,0,400,300);
					var blob = Util.dataURLToBlob(canvas.toDataURL());
					// $http.put("http://localhost:8080/trainface/gurpal2", blob)
					// .then(function(data) {
					// 	$log.debug("Posted");
					// });
					ws.send(blob);
				}, 1000, 0, true, video, ctx);
	    };

	    ws.onmessage = function(message) {
	    	$log.debug("findFaces message received");
	    	var rec = document.getElementById('received');
	    	var url = $window.URL.createObjectURL(message.data);
	    	rec.src = url;
	    };

			nav.webkitGetUserMedia({video:true}, function(stream) {
				video.src = $window.URL.createObjectURL(stream);
				video.play();
			}, function() {
				// If camera fails to open
				$mdToast.show(
					$mdToast.simple()
					.textContent('Unable to get open camera')
					.hideDelay(5000)
					.position("bottom right")
				);
			});
		}]);

})();