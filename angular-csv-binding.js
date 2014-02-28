'use strict';

angular.module('csvBinding', [])
.directive('csv', [function(){
	return {
		require: 'ngModel',
		restrict: 'CA',
		scope: {
			delimiter: '=',
			hasHeaders: '='
		},
		link: function(scope, element, attr, ngModel){
			scope.delimiter == scope.delimiter || ',';
			scope.hasHeaders == angular.isDefined(scope.hasHeaders)? scope.hasHeaders : true;

			// This will parse a delimited string into an array of
			// arrays. The default delimiter is the comma, but this
			// can be overriden in the second argument.
			function CSVToArray(strData){
				var delimiter = scope.delimiter || ',',
					hasHeaders = angular.isDefined(scope.hasHeaders)? scope.hasHeaders : true;

				var headers = [];

				// Create a regular expression to parse the CSV values.
				var objPattern = new RegExp(
					(
						// Delimiters.
						"(\\" + delimiter + "|\\r?\\n|\\r|^)" +

						// Quoted fields.
						"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

						// Standard fields.
						"([^\"\\" + delimiter + "\\r\\n]*))"
					),
					"gi"
				);

				// Create an array to hold our data. Give the array
				// a default empty first row.
				var arrData = [[]];

				// Create an array to hold our individual pattern
				// matching groups.
				var arrMatches = null;


				// Keep looping over the regular expression matches
				// until we can no longer find a match.
				var column = 0;
				while (arrMatches = objPattern.exec( strData )){

					// Get the delimiter that was found.
					var strMatchedDelimiter = arrMatches[ 1 ];

					// Check to see if the given delimiter has a length
					// (is not the start of string) and if it matches
					// field delimiter. If id does not, then we know
					// that this delimiter is a row delimiter.
					if (strMatchedDelimiter.length && (strMatchedDelimiter != delimiter)){

						// If this is the first row and we have headers
						// capture the headers for future use
						if(arrData.length == 1 && hasHeaders && !headers.length){
							headers = arrData[0].slice(0);
							arrData.splice(0,1);
						}

						// Since we have reached a new row of data,
						// add an empty row to our data array.
						arrData.push( headers.length?{}:[] );
						column = 0;
					}


					// Now that we have our delimiter out of the way,
					// let's check to see which kind of value we
					// captured (quoted or unquoted).
					if (arrMatches[ 2 ]){
						// We found a quoted value. When we capture
						// this value, unescape any double quotes.
						var strMatchedValue = arrMatches[ 2 ].replace(
							new RegExp( "\"\"", "g" ),
							"\""
							);

					} else {
						// We found a non-quoted value.
						var strMatchedValue = arrMatches[ 3 ];

					}


					// Now that we have our value string, let's add
					// it to the data array.
					var currentRow = arrData[arrData.length - 1];
					if(headers.length !== 0){
						currentRow[headers[column]] = strMatchedValue;
					}else{
						currentRow.push( strMatchedValue );
					}
					column++;
				}

				// Return the parsed data.
				return( arrData );
			}

			var parseCSV = function(value){
				try{
					var csv = CSVToArray(value);
					return csv;
				}catch(e){
					console.log(e);
					return value;
				}
			}

			function ArrayToCSV(array){
				var delimiter = scope.delimiter || ',',
					hasHeaders = angular.isDefined(scope.hasHeaders)? scope.hasHeaders : true,
					out = [];

				//Get updated headers
				if(hasHeaders){
					var headers = [];
					angular.forEach(array, function(item){
						angular.forEach(item, function(value, key){
							if(headers.indexOf(key) == -1){
								headers.push(key);
							}
						});
					});
					out.push(headers.join(delimiter));
				}

				//Prepare out string
				angular.forEach(array, function(item){
					var outLine = [];

					if(hasHeaders){
						angular.forEach(headers, function(header){
							outLine.push(item[header] || '');
						});
					}else{
						angular.forEach(item, function(value){
							outLine.push(value);
						});
					}
					
					out.push(outLine.join(delimiter));
				});
				return out.join('\n');
			}

			ngModel.$parsers.unshift(parseCSV);
			ngModel.$formatters.push(ArrayToCSV);

			var render = function(v){
				var viewValue = ngModel.$modelValue;
				if (viewValue == null || !viewValue.length) return;
				for (var i in ngModel.$formatters) {
					viewValue = ngModel.$formatters[i](viewValue);
				}
				ngModel.$viewValue = viewValue;
				ngModel.$render();
			}

			scope.$watch('delimiter', render);
			scope.$watch('hasHeaders', render);
		}
	}
}]);