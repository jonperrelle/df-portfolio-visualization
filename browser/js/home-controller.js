'use strict';

app.controller('HomeController', function ($scope, GraphFactory) {
	let timeseries;
	GraphFactory.getData()
	.then(data => {
		$scope.accountData = data;
		$scope.positions = data.account_positions[0].positions;
		timeseries = data.timeseries;
		$scope.timeseries = timeseries;
	});

	$scope.filterTime = function (time) {
		$scope.timeseries = GraphFactory.filterTime(time, timeseries);
	};

	
});