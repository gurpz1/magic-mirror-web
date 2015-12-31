(function() {
	'use strict';

	angular.module('magicMirror')
	.controller('HomeController', [
		'$scope',
		'$mdToast',
		'$window',
		'$interval',
		function($scope, $mdToast, $window, $interval) {

			var nav = $window.navigator;
			var video = document.getElementById('liveVideo');
			var canvas = document.getElementById('overlay');
			var ctx = canvas.getContext('2d');

			var ws = new WebSocket("ws://localhost:8080/detect");
	    ws.onopen = function () {
	              console.log("Openened connection to websocket");
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

			// Capture the image from the video
			$interval(function(video, ctx) {
				ctx.drawImage(video,0,0,400,300);
				var blob = Util.dataURLToBlob(canvas.toDataURL());
				ws.send(blob);
			}, 300, 0, true, video, ctx);

		}]);

})();