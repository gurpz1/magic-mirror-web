(function() {
	'use strict';

	angular.module('magicMirror')
	// Config constants
	.constant('config', {
		host: 'localhost',
		websocketPort:'3010',
		httpPort:'3011'
	});
})();