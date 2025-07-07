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

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const MetroApi = require('..');

const os = require('os');var _require =

require('../cli-utils');const fetchMetroConfig = _require.fetchMetroConfig,makeAsyncCommand = _require.makeAsyncCommand;



exports.command = 'build <entry>';

exports.builder = yargs => {
  yargs.option('project-roots', {
    alias: 'P',
    type: 'string',
    array: true });

  yargs.option('out', { alias: 'O', type: 'string', demandOption: true });

  yargs.option('platform', { alias: 'p', type: 'string' });
  yargs.option('output-type', { alias: 't', type: 'string' });

  yargs.option('max-workers', {
    alias: 'j',
    type: 'number',
    default: Math.max(1, Math.floor(os.cpus().length)) });


  yargs.option('optimize', { alias: 'z', type: 'boolean' });
  yargs.option('dev', { alias: 'g', type: 'boolean' });

  yargs.option('source-map', { type: 'boolean' });
  yargs.option('source-map-url', { type: 'string' });

  yargs.option('legacy-bundler', { type: 'boolean' });

  yargs.option('config', { alias: 'c', type: 'string' });

  // Deprecated
  yargs.option('reset-cache', { type: 'boolean', describe: null });
};

// eslint-disable-next-line no-unclear-flowtypes
exports.handler = makeAsyncCommand((() => {var _ref = _asyncToGenerator(function* (argv) {
    const config = yield fetchMetroConfig(argv.config);
    yield MetroApi.runBuild(_extends({}, argv, { config }));
  });return function (_x) {return _ref.apply(this, arguments);};})());