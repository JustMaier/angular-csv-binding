angular-csv-binding
=========================

Easily bind arrays of data to a textarea with CSV formating

[**Check out a demo!**](http://justmaier.github.io/angular-csv-binding/)

##Installation

####Bower
`bower install angular-csv-binding`

####Manually
`<script type="text/javascript" src="js/angular-csv-binding.js"></script>`

##Usage

1. Include the `angular-csv-binding.js` script provided by this component into your app
2. add `csvBinding` as a module dependency to your app

####Javascript
```javascript
angular.module('app', ['csvBinding'])
.controller('demo', ['$scope', function($scope){
	$scope.data = [{a:'test',b:'test2'}, {a:'test3',b:'test4'}];
	$scope.delimiter = ',';
	$scope.hasHeaders = true;
}]);
```

####html
```html
<textarea class="form-control" rows="10" csv delimiter="delimiter" has-headers="hasHeaders" ng-model="data"></textarea> 
<pre ng-bind="data | json"></pre>
```

##Options
* `delimiter` the separator of the values
* `hasHeaders` whether or not the data you are providing has headers for each column
