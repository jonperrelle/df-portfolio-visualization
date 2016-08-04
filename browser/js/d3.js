(function () {

    'use strict';
    let app = angular.module('d3',[]);

    app.factory('d3Service', function($document, $q, $rootScope) {
      let d = $q.defer();
      function onScriptLoad() {
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }
      
      let scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'https://d3js.org/d3.v4.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      };
      scriptTag.onload = onScriptLoad;
 
      let b = $document[0].getElementsByTagName('body')[0];
      b.appendChild(scriptTag);
 
      return {
        d3: function() { return d.promise; }
      };
  });
})();