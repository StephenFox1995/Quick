'use strict';

var date = require('date-and-time');



function BusinessObject() {
}

BusinessObject.prototype.setCreationTime = function() {
  var now = new Date();
  this.timestamp = date.format(now, 'YYYY-MM-DD HH:mm:ss');
};

module.exports = BusinessObject;