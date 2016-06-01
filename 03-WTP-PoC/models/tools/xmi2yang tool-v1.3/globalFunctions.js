// Set of functions to improve and debug the xmi2yang tool.

if (!String.prototype.contains) {
  String.prototype.contains = function(search) {
    return this.indexOf(search) > -1;
  }
}

if (!String.prototype.toYangDescription) {
  String.prototype.toYangDescription = function() {
    var output = this.replace(/\"/g, '\'');
    
    // remove unit lines
    var lines = output.split('\r\n');
    var newOutput = [];
    lines.map(function(line){
      if (!line.startsWith('_unit')) {
        newOutput.push( line );
      }
    });
    return newOutput.join('\r\n');
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
      edate : 'date-and-time',
      _ogqi1llneeo75do39gbf8q : 'CoreModel-CoreFoundationModule-TypeDefinitions:DateAndTime',
      _YbA4MHfbEeWiOPc9pTMjTg : 'string', // airInterfacePort
      "_Ewcf0HlAEeW1-cr9O9dzWA" : 'string', // port
      _h9yzUIewEeWaZYk7gpuOtw : 'string' // ethernetSwitch
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
