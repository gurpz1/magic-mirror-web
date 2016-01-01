(function(module) {
try {
  module = angular.module('magicMirrorPartials');
} catch (e) {
  module = angular.module('magicMirrorPartials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/home.html',
    '<video id="liveVideo" width="400" height="300" preload="auto"></video>\n' +
    '<canvas id="overlay" width="400" height="300"></canvas>\n' +
    '<img id="received" width="400" height="300"></img>\n' +
    '');
}]);
})();
