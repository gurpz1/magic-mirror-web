(function() {
  'use strict';

  angular.module('magicMirror')
  .controller('recognitionController', [
    '$scope',
    '$mdToast',
    '$window',
    '$interval',
    '$log',
    '$http',
    function($scope, $mdToast, $window, $interval, $log, $http) {

      $scope.submit = function() {
        $scope.found = false;
        
        ctx.drawImage(video,0,0,400,300);

        var toPost ={};
        toPost.image = canvas.toDataURL("image/png");
            
        $http.post("http://localhost:9000/faces/whoami", toPost)
        .then(function(data) {
          $scope.found = true;
          $scope.faceName = data.data;
          $log.debug("Posted");
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