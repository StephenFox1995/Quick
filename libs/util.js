var util = exports;

util.isValidString = function (string) {
  switch (string) {
    case "":
    case 0:
    case "0":
    case null:
    case false:
    case typeof this == "undefined":
      return true;
    default:
      return false;
  }
};

module.exports = util;
  
