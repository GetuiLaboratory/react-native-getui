/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const fs = require('fs-extra');
const path = require('path');



const METRO_CONFIG_FILENAME = 'metro.config.js';

exports.watchFile = (() => {var _ref = _asyncToGenerator(function* (
  filename,
  callback)
  {
    fs.watchFile(filename, function () {
      callback();
    });

    yield callback();
  });return function (_x, _x2) {return _ref.apply(this, arguments);};})();

exports.findMetroConfig = (() => {var _ref2 = _asyncToGenerator(function* (filename) {
    if (filename) {
      return path.resolve(process.cwd(), filename);
    } else {
      let previous;
      let current = process.cwd();

      do {
        const filename = path.join(current, METRO_CONFIG_FILENAME);

        if (fs.existsSync(filename)) {
          return filename;
        }

        previous = current;
        current = path.dirname(current);
      } while (previous !== current);

      return null;
    }
  });return function (_x3) {return _ref2.apply(this, arguments);};})();

exports.fetchMetroConfig = (() => {var _ref3 = _asyncToGenerator(function* (
  filename)
  {
    const location = yield exports.findMetroConfig(filename);
    if (location) {
      // $FlowFixMe: We want this require to be dynamic
      return require(location);
    } else {
      return {};
    }
  });return function (_x4) {return _ref3.apply(this, arguments);};})();

// eslint-disable-next-line no-unclear-flowtypes
exports.makeAsyncCommand = command =>
// eslint-disable-next-line no-unclear-flowtypes
argv =>
{
  Promise.resolve(command(argv)).catch(error => {
    console.error(error.stack);
    process.exitCode = 1;
  });
};