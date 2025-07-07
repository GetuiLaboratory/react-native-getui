'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (lines) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (config.border === false) {
    return new _BaseMessage.BaseMessage(lines, config).print();
  } else {
    return new _BorderedMessage.BorderedMessage(lines, config).print();
  }
};

var _BaseMessage = require('./messages/BaseMessage');

var _BorderedMessage = require('./messages/BorderedMessage');

module.exports = exports['default'];

/**
 * Print messages to console.
 *
 * @param {Array} lines Array of lines
 * @param {Object} [config] Additional params for print
 */