// Set of functions to improve and debug the xmi2yang tool.

if (!String.prototype.toYangDescription) {
  String.prototype.toYangDescription = function() {
    var output = this.replace(/\"/g, '\'');
    return output;
  }
}

var globalFunctions = {};

globalFunctions.eCorePrimitiveTypes = {
    mappingToYangTypes: {
      eboolean: 'boolean',
      eint: 'integer',
      ebyte : 'uint8',
      eshort : 'uint16',
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