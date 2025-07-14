'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMessage = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Regex for ANSI symbols.
 *
 * @type {RegExp}
 */
var ANSI_REGEX = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;

/**
 * Regex for symbols that have length 2 when should be 1.
 *
 * @type {RegExp}
 */
var ASTRAL_REGEX = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/**
 * BaseMessage class which is showing message without borders or animations.
 * If you want to create your own message you must extends from this class.
 *
 * @since 2.0.0
 * @version 2.0.0
 */

var BaseMessage = exports.BaseMessage = function () {
  /**
   * Creates new message instance.
   *
   * @constructor
   * @param {Array} [lines] Array of strings that you want to print out
   * @param {Object} [config] Configuration object
   * @param {String} [config.color] Foreground color
   * @param {Number} [config.marginTop] Count of lines before print message
   * @param {Number} [config.marginBottom] Count of lines after print message
   * @param {Function} [config.printFn] Function that used to print transformed message
   */

  function BaseMessage(lines, config) {
    _classCallCheck(this, BaseMessage);

    this._lines = [];
    this._config = {
      color: 'default',
      marginTop: 0,
      marginBottom: 0,
      printFn: process.stdout.write.bind(process.stdout)
    };

    this.setLines(lines);
    this.setConfig(config);
  }

  /**
   * Get lines that must be printed out to console.
   *
   * @returns {Array}
   */

  _createClass(BaseMessage, [{
    key: 'getLines',
    value: function getLines() {
      return this._lines;
    }

    /**
     * Set lines that you want to print out.
     *
     * @param {Array} [lines]
     * @returns {BaseMessage}
     */

  }, {
    key: 'setLines',
    value: function setLines() {
      var lines = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this._lines = lines.map(function (line) {
        return ' ' + line + ' ';
      });
      return this;
    }

    /**
     * Get configuration value or the whole object.
     *
     * @param {String} [key]
     * @returns {*}
     */

  }, {
    key: 'getConfig',
    value: function getConfig(key) {
      return typeof key === 'string' ? this._config[key] : this._config;
    }

    /**
     * Set new configuration value or new configuration object.
     *
     * @param {Object} config
     * @returns {BaseMessage}
     */

  }, {
    key: 'setConfig',
    value: function setConfig() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._config = Object.assign(this._config, config);
      return this;
    }

    /**
     * Converts lines to string representation.
     *
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString() {
      var lines = this.getLines();
      var config = this.getConfig();

      if (config.color !== 'default' && !_chalk2.default[config.color]) throw new Error('Color ' + config.color + ' is not supported');

      return ['\n'.repeat(config.marginTop), lines.reduce(function (message, line) {
        return message + (config.color !== 'default' ? _chalk2.default[config.color](line) : line) + '\n';
      }, ''), '\n'.repeat(config.marginBottom)].join('');
    }

    /**
     * Prints out lines.
     *
     * @returns {BaseMessage}
     */

  }, {
    key: 'print',
    value: function print() {
      this.getConfig('printFn')(this.toString());
      return this;
    }

    /**
     * Calculates and returns correct text length.
     *
     * @returns {Number}
     */

  }], [{
    key: 'getTextLength',
    value: function getTextLength(string) {
      return string.replace(ANSI_REGEX, '').replace(ASTRAL_REGEX, ' ').length;
    }
  }]);

  return BaseMessage;
}();