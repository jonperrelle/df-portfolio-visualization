'use strict';

app.factory('GraphFactory', function (d3Service, $http) {

	 let filterFunction = function (arr, date) {
	 	if (date === 'none') return arr;
	 	let idx = 0, filteredArr = [];
	 	for (var i = 0 ; i < arr.length ; i++) {	
	 		if (date.diff(moment(arr[i].date, 'YYYY-MM-DD')) <= 0) {
	 			idx = i;
	 			break; 
	 		}
	 	}
	 	for (var j = idx ; j < arr.length ; j++) {
	 		filteredArr.push(arr[j]);
	 	}
	 	return filteredArr;
	 };

	 let graphFactory = {};
	 graphFactory.getData = function () {
	 	return $http.get('/coding exercise JSON.json')
	 			.then(response => response.data)
	 			.catch(function (err) {
	 				console.log(err);
	 			});

	 };

	 graphFactory.filterTime = function (time, timeseries) {
	 	let a = moment(timeseries[timeseries.length-1].date, "YYYY-MM-DD"),
	 	b = a.clone(),
	 	filterDate;
	 	switch (time) {
	 		case '1w':
	 			filterDate = b.subtract(7, 'days');
	 			break;
	 		case '1m':
	 			filterDate = b.subtract(1, 'months');
	 			break;
	 		case '6m':
	 			filterDate = b.subtract(6, 'months');
	 			break;
	 		case '1y':
	 			filterDate = b.subtract(1, 'years');
	 			break;
	 		case '2y':
	 			filterDate = b.subtract(2, 'years');
	 			break;
	 		case 'max':
	 			filterDate = 'none';
	 			break;
	 		default:
	 			filterDate = 'none';

	 	}
	 	return filterFunction(timeseries, filterDate);
	 };

	 return graphFactory;

});