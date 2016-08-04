app.directive('accountTable', function(NgTableParams, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'browser/html/account-table.html',
        scope: {
            dataset: "=",
        },
        link: function (scope, ele, attrs) {
            scope.columns = ['name', 'ticker', 'shares', 'price', 'value'];
            $timeout( function () {
                scope.tableParams = new NgTableParams({}, { 
                    dataset: scope.dataset,
                    counts: []
                });
            }, 0);
        }
    };
});