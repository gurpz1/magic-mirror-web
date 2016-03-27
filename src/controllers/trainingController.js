(function() {
  'use strict';

  angular.module('magicMirror')
  .controller('trainingController', [
    '$scope',
    '$mdToast',
    '$window',
    '$interval',
    '$log',
    '$http',
    function($scope, $mdToast, $window, $interval, $log, $http) {

      $scope.facesToGet =1000;
      $scope.facesSent =0;
      $scope.interval = 100;
      $scope.started = false;
      $scope.state="Start";

      var poster;

      $scope.switchDetection = function() {
        if($scope.state == "Start")
          $scope.state = "Stop";
        else
          $scope.state = "Start";
        $scope.started = !$scope.started;

        if($scope.started) {
          $log.info("Starting test");
          // Capture the image from the video
          poster = $interval(function(video, ctx) {
            ctx.drawImage(video,0,0,400,300);

            var toPost ={};
            toPost.image = canvas.toDataURL("image/png");

            $http.put("http://localhost:9000/faces/train/gurpal", toPost)
            .then(function(data) {
              $scope.facesCount = data.data;
              $log.debug("Posted");
            });
            
            $scope.facesSent++;

          }, $scope.interval, 0, true, video, ctx);
        } else {
          if(angular.isDefined(poster)) {
            $log.info("Stopping test");
            $interval.cancel(poster);
            $scope.facesSent = 0;
            poster = undefined;
          }
        }
      };

      $scope.train = function() {
          $log.debug("Sent training request");
          var toPost ={};
          toPost.keyword="do it now";

          $http.post("http://localhost:9000/faces/train", toPost)
            .then(function(data) {
              $mdToast.show(
              $mdToast.simple()
              .textContent('Training Completed')
              .hideDelay(5000)
              .position("bottom right")
            );
            });
            
        };


      var nav = $window.navigator;
      var video = document.getElementById('liveVideo');
      var canvas = document.getElementById('sent');
      var ctx = canvas.getContext('2d');

      // Start the webcam
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