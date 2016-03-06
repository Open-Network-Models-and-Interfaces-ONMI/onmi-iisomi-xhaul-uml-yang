// Set of functions to improve and debug the xmi2yang tool.

if (!String.prototype.contains) {
  String.prototype.contains = function(search) {
    return this.indexOf(search) > -1;
  }
}
if (!String.prototype.toYangDescription) {
  String.prototype.toYangDescription = function() {
    var output = this.replace(/\"/g, '\'');
    return output;
  }
}

if (!Array.prototype.contains) {
Array.prototype.contains = function(obj) {
    return this.indexOf(obj) !== -1;
}
}


var globalFunctions = {};

globalFunctions.eCorePrimitiveTypes = {
    mappingToYangTypes: {
      eboolean: 'boolean',
      eint: 'int32',
      int: 'int32',
      ebyte : 'int32',
      byte : 'int32',
      elong : 'int64',
      eshort : 'int32',
      estring : 'string',
      edate : 'date-and-time'
    },
    mapToYangType: function(type) {
      var output = this.mappingToYangTypes[type];
      if (!output) {
        output = type;
      }
      return output;
    }
};
module.exports = globalFunctions;
