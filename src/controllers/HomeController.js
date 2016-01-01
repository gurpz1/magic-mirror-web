(function() {
	'use strict';

	angular.module('magicMirror')
	.controller('HomeController', [
		'$scope',
		'$mdToast',
		'$window',
		'$interval',
		'$log',
		function($scope, $mdToast, $window, $interval, $log) {

			var nav = $window.navigator;
			var video = document.getElementById('liveVideo');
			var canvas = document.getElementById('overlay');
			var ctx = canvas.getContext('2d');

			var ws = new WebSocket("ws://localhost:8080/detect");
	    ws.onopen = function () {
				$log.debug("Opened connection to websocket");
				// Capture the image from the video
				$interval(function(video, ctx) {
					ctx.drawImage(video,0,0,400,300);
					var blob = Util.dataURLToBlob(canvas.toDataURL());
					ws.send(blob);
				}, 500, 0, true, video, ctx);

	    };

	    ws.onmessage = function(message) {
	    	$log.debug("message received");
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