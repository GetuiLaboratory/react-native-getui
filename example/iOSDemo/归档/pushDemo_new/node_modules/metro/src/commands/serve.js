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






require('../cli-utils');const findMetroConfig = _require.findMetroConfig,fetchMetroConfig = _require.fetchMetroConfig,watchFile = _require.watchFile,makeAsyncCommand = _require.makeAsyncCommand;var _require2 =
require('util');const promisify = _require2.promisify;



exports.command = 'serve';

exports.builder = yargs => {
  yargs.option('project-roots', {
    alias: 'P',
    type: 'string',
    array: true });


  yargs.option('host', { alias: 'h', type: 'string', default: 'localhost' });
  yargs.option('port', { alias: 'p', type: 'number', default: 8080 });

  yargs.option('max-workers', {
    alias: 'j',
    type: 'number',
    default: Math.max(1, Math.floor(os.cpus().length)) });


  yargs.option('secure', { type: 'boolean' });
  yargs.option('secure-key', { type: 'string' });
  yargs.option('secure-cert', { type: 'string' });

  yargs.option('hmr-enabled', { alias: 'hmr', type: 'boolean' });

  yargs.option('config', { alias: 'c', type: 'string' });

  // Deprecated
  yargs.option('reset-cache', { type: 'boolean', describe: null });
};

// eslint-disable-next-line no-unclear-flowtypes
exports.handler = makeAsyncCommand((() => {var _ref = _asyncToGenerator(function* (argv) {let restart = (() => {var _ref2 = _asyncToGenerator(



      function* () {
        if (restarting) {
          return;
        } else {
          restarting = true;
        }

        if (server) {
          console.log('Configuration changed. Restarting the server...');
          yield promisify(server.close).call(server);
        }

        const config = yield fetchMetroConfig(argv.config);

        server = yield MetroApi.runServer(_extends({},
        argv, {
          config }));


        restarting = false;
      });return function restart() {return _ref2.apply(this, arguments);};})();let server = null;let restarting = false;

    const metroConfigLocation = yield findMetroConfig(argv.config);

    if (metroConfigLocation) {
      yield watchFile(metroConfigLocation, restart);
    } else {
      yield restart();
    }
  });return function (_x) {return _ref.apply(this, arguments);};})());