// Helpful range checker provided by David Thomas: http://stackoverflow.com/a/18881828
Number.prototype.between = function (a, b, inclusive) {
    var min = Math.min.apply(Math, [a,b]),
        max = Math.max.apply(Math, [a,b]);
    return inclusive ? this >= min && this <= max : this > min && this < max;
};

(function() {

  'use strict';


  var cf = angular.module('coordinateFilter', []);

cf.directive('numberFormater', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {

      modelCtrl.$parsers.push(function (inputValue) {
        
        
        console.info('#### ', inputValue);

        var transformedInput = parseFloat(inputValue).toFixed(6); 

        if (transformedInput !== inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }         

        return transformedInput;         
      });
    }
  };
});

  cf.filter('coordinateFilter', coordinateFilter);

    function coordinateFilter($sce) {
      
      return function(coordinate, conversion, type, places) {

        // The filter will be running as we type values into the input boxes, which returns undefined
        // and brings up an error in the console. Here wait until the coordinate is defined
        if(coordinate != undefined) {

          // Check for user input that is a positive or negative number with the option
          // that it is a float. Match only the numbers and not the white space or other characters
          var pattern = /[-+]?[0-9]*\.?[0-9]+/g
          var match = String(coordinate).match(pattern);

          if(conversion === "toDD" && match && coordinateIsValid(match, type)) {
            // If the match array only has one item, the user has provided decimal degrees
            // and we can just return what the user typed in
            if(match.length === 1) {
              return parseFloat(match);
            }

            // If the match array has a length of three then we know degrees, minutes, and seconds
            // were provided so we can convert it to decimal degrees
            if(match.length === 3) {
              return toDecimalDegrees(match);
            }
          }

          else if(conversion === 'toDMS' && match && coordinateIsValid(match, type)) {
            // When converting from decimal degrees to degrees, minutes and seconds, if
            // the match array has one item we know the user has input decimal degrees
            // so we can convert it to degrees, minutes and seconds
            if(match.length === 1) {
              return toDegreesMinutesSeconds(match, type);
            }

            // To properly format the converted coordinates we will need to add in HTML entities
            // which means we'll need to bind the returned string as HTML and thus we need
            // to use $sce (Strict Contextual Escaping) to say that we trust what is being bound as HTML
            if(match.length === 3) {
              return $sce.trustAsHtml(match[0] + '&deg; ' + match[1] + '&prime; ' + match[2] + '&Prime; ');           
            }
          }

          // Output a notice that the coordinates are invalid if they are
          else if(!coordinateIsValid(match, type)) {
            return "Invalid Coordinate!";
          }       

          function toDecimalDegrees(coord) {
            // Setup for all parts of the DMS coordinate and the necessary math to convert
            // from DMS to DD
            var degrees = parseInt(coord[0]);
            var minutes = parseInt(coord[1]) / 60;
            var seconds = parseInt(coord[2]) / 3600;

            // When the degrees value is negative, the math is a bit different
            // than when the value is positive. This checks whether the value is below zero
            // and does subtraction instead of addition if it is. 
            if(degrees < 0) {
              var calculated = degrees - minutes - seconds;
              return calculated.toFixed(places || 4);
            }
            else {
              var calculated = degrees + minutes + seconds
              return calculated.toFixed(places || 4);
            }
          }

          // This function converts from DD to DMS. Math.abs is used a lot because
          // for the minutes and seconds, negative values aren't valid 
          function toDegreesMinutesSeconds(decimal_degrees, type) {
            
            var dd = decimal_degrees[0];
            var direction = 'E';

            if (type === 'lat') {
              if (dd < 0) {
                direction = 'S';
              } else {
                direction = 'N'
              }
            } else {
              if (dd < 0) {
                direction = 'W';
              } else {
                direction = 'E'
              }
            }
            
            dd = Math.abs(dd);
            var degrees = Math.floor(dd);
            var frac = dd - degrees; // get fractional part
            var min = Math.floor(frac * 60);
            var sec = frac * 3600 - min * 60;
            
            var formated = [degrees, '° ', ("0" + min).slice(-2), '\' ', ("0" + sec.toFixed(4)).slice(-7), '\" ', direction];
            return formated.join('');
            
 //           var degrees = coordinate[0].split('.')[0];
 //           var minutes = Math.abs(Math.floor(60 * (Math.abs(coordinate[0]) - Math.abs(degrees))));
 //           var seconds = 3600 * (Math.abs(coordinate[0]) - Math.abs(degrees) - Math.abs(minutes) / 60).toFixed(2);

//            return $sce.trustAsHtml(degrees + '° ' + minutes + '\' ' + seconds + '\" ');
                  
          }

          // This function checks whether the coordinate value the user enters is valid or not. 
          // If the coordinate doesn't pass one of these rules, the function will return false
          // which will then alert the user that the coordinate is invalid.
          function coordinateIsValid(coordinate, type) {
            if(coordinate) {

              // The degree values of latitude coordinates have a range between -90 and 90
              if(coordinate[0] && type === 'lat') {
                if(!parseInt(coordinate[0]).between(-90, 90)) return false; 
              }
              // The degree values longitude coordinates have a range between -180 and 180
              else if(coordinate[0] && type === 'lon') {
                if(!parseInt(coordinate[0]).between(-180, 180)) return false;
              }
              // Minutes and seconds can only be between 0 and 60
              if(coordinate[1]) {
                if(!parseInt(coordinate[1]).between(0, 60)) return false;
              }
              if(coordinate[2]) {
                if(!parseInt(coordinate[2]).between(0, 60)) return false;
              }                         
            }
            
            // If the coordinate made it through all the rules above, the function
            // returns true because the coordinate is good
            return true;
          }         
        }       
      }
    }

})();