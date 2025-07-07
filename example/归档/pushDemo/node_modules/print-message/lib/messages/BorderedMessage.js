'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BorderedMessage = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _BaseMessage2 = require('./BaseMessage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class responsible for printing out bordered messages
 *
 * @since 2.0.0
 * @version 2.0.0
 */

var BorderedMessage = exports.BorderedMessage = function (_BaseMessage) {
  _inherits(BorderedMessage, _BaseMessage);

  function BorderedMessage(lines, config) {
    _classCallCheck(this, BorderedMessage);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BorderedMessage).call(this, lines, config));

    _this.setConfig({
      borderColor: 'yellow',
      borderSymbol: '─',
      sideSymbol: '│',
      leftTopSymbol: '┌',
      leftBottomSymbol: '└',
      rightTopSymbol: '┐',
      rightBottomSymbol: '┘',
      paddingTop: 0,
      paddingBottom: 0
    }).setConfig(config);
    return _this;
  }

  /**
   * Makes bordered message.
   *
   * @returns {String}
   */

  _createClass(BorderedMessage, [{
    key: 'toString',
    value: function toString() {
      var _Math;

      var lines = this.getLines();
      var config = this.getConfig();
      var maxWidth = (_Math = Math).max.apply(_Math, _toConsumableArray(lines.map(function (line) {
        return _BaseMessage2.BaseMessage.getTextLength(line);
      })));

      if (config.color !== 'default' && !_chalk2.default[config.color]) throw new Error('Color ' + config.color + ' is not supported');
      if (config.borderColor !== 'default' && !_chalk2.default[config.borderColor]) throw new Error('Color ' + config.borderColor + ' is not supported');

      var topBorder = _chalk2.default[config.borderColor](config.leftTopSymbol + config.borderSymbol.repeat(maxWidth) + config.rightTopSymbol);
      var sideSeparator = _chalk2.default[config.borderColor](config.sideSymbol);
      var bottomBorder = _chalk2.default[config.borderColor](config.leftBottomSymbol + config.borderSymbol.repeat(maxWidth) + config.rightBottomSymbol);

      return ['\n'.repeat(config.marginTop), topBorder + '\n', (sideSeparator + ' '.repeat(maxWidth) + sideSeparator + '\n').repeat(config.paddingTop), lines.reduce(function (message, line) {
        return message + sideSeparator + (config.color !== 'default' ? _chalk2.default[config.color](line) : line) + ' '.repeat(maxWidth - _BaseMessage2.BaseMessage.getTextLength(line)) + sideSeparator + '\n';
      }, ''), (sideSeparator + ' '.repeat(maxWidth) + sideSeparator + '\n').repeat(config.paddingBottom), bottomBorder + '\n', '\n'.repeat(config.marginBottom)].join('');
    }
  }]);

  return BorderedMessage;
}(_BaseMessage2.BaseMessage);