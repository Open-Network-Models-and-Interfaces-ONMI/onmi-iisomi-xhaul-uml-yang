// Set of functions to improve and debug the xmi2yang tool.

if (!String.prototype.toYangDescription) {
  String.prototype.toYangDescription = function() {
    var output = this.replace(/\"/g, '\'');
    return output;
  }
}

var eCore2YangPrimitivTypeMapping = {
  eBoolean: 'boolean',
  eInt: 'integer',
  eByte : 'uint8',
  eShort : 'uint16'
};