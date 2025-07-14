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

'use strict';









































// We'll be able to remove this to use the one provided by modern versions of
// fs-extra once https://github.com/jprichardson/node-fs-extra/pull/520 will
// have been merged (until then, they'll break on devservers/Sandcastle)
let asyncRealpath = (() => {var _ref = _asyncToGenerator(function* (path) {
    return new Promise(function (resolve, reject) {
      realpath(path, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  });return function asyncRealpath(_x) {return _ref.apply(this, arguments);};})();let runMetro = (() => {var _ref2 = _asyncToGenerator(

  function* (_ref3)








  {let config = _ref3.config;var _ref3$resetCache = _ref3.resetCache;let resetCache = _ref3$resetCache === undefined ? false : _ref3$resetCache;var _ref3$maxWorkers = _ref3.maxWorkers;let maxWorkers = _ref3$maxWorkers === undefined ? 1 : _ref3$maxWorkers;var _ref3$port = _ref3.port;let port = _ref3$port === undefined ? null : _ref3$port;var _ref3$projectRoots = _ref3.projectRoots;let projectRoots = _ref3$projectRoots === undefined ? [] : _ref3$projectRoots;var _ref3$reporter = _ref3.reporter;let reporter = _ref3$reporter === undefined ? new TerminalReporter(new Terminal(process.stdout)) : _ref3$reporter;var _ref3$watch = _ref3.watch;let watch = _ref3$watch === undefined ? false : _ref3$watch;
    const normalizedConfig = config ? Config.normalize(config) : Config.DEFAULT;

    const assetExts = defaults.assetExts.concat(
    normalizedConfig.getAssetExts && normalizedConfig.getAssetExts() || []);

    const sourceExts = defaults.sourceExts.concat(
    normalizedConfig.getSourceExts && normalizedConfig.getSourceExts() || []);

    const platforms =
    normalizedConfig.getPlatforms && normalizedConfig.getPlatforms() || [];

    const transformModulePath = false ?
    `` :
    normalizedConfig.getTransformModulePath();

    const providesModuleNodeModules =
    typeof normalizedConfig.getProvidesModuleNodeModules === 'function' ?
    normalizedConfig.getProvidesModuleNodeModules() :
    defaults.providesModuleNodeModules;

    const finalProjectRoots = yield Promise.all(
    normalizedConfig.
    getProjectRoots().
    concat(projectRoots).
    map(function (path) {return asyncRealpath(path);}));


    reporter.update({
      type: 'initialize_started',
      port,
      projectRoots: finalProjectRoots });


    const serverOptions = {
      assetExts: normalizedConfig.assetTransforms ? [] : assetExts,
      assetRegistryPath: normalizedConfig.assetRegistryPath,
      blacklistRE: normalizedConfig.getBlacklistRE(),
      createModuleIdFactory: normalizedConfig.createModuleIdFactory,
      dynamicDepsInPackages: normalizedConfig.dynamicDepsInPackages,
      extraNodeModules: normalizedConfig.extraNodeModules,
      getPolyfills: normalizedConfig.getPolyfills,
      getModulesRunBeforeMainModule:
      normalizedConfig.getModulesRunBeforeMainModule,
      getTransformOptions: normalizedConfig.getTransformOptions,
      globalTransformCache: null,
      hasteImpl: normalizedConfig.hasteImpl,
      maxWorkers,
      platforms: defaults.platforms.concat(platforms),
      postMinifyProcess: normalizedConfig.postMinifyProcess,
      postProcessModules: normalizedConfig.postProcessModules,
      postProcessBundleSourcemap: normalizedConfig.postProcessBundleSourcemap,
      providesModuleNodeModules,
      resetCache,
      reporter,
      sourceExts: normalizedConfig.assetTransforms ?
      sourceExts.concat(assetExts) :
      sourceExts,
      transformCache: TransformCaching.useTempDir(),
      transformModulePath,
      watch,
      workerPath:
      normalizedConfig.getWorkerPath && normalizedConfig.getWorkerPath(),
      projectRoots: finalProjectRoots };


    return new MetroServer(serverOptions);
  });return function runMetro(_x2) {return _ref2.apply(this, arguments);};})();function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const Config = require('./Config');const Http = require('http');const Https = require('https');const MetroBundler = require('./shared/output/bundle');const MetroHmrServer = require('./HmrServer');const MetroServer = require('./Server');const TerminalReporter = require('./lib/TerminalReporter');const TransformCaching = require('./lib/TransformCaching');const attachWebsocketServer = require('./lib/attachWebsocketServer');const defaults = require('./defaults');var _require = require('fs');const realpath = _require.realpath;var _require2 = require('fs-extra');const readFile = _require2.readFile;var _require3 = require('metro-core');const Terminal = _require3.Terminal;





exports.createConnectMiddleware = (() => {var _ref4 = _asyncToGenerator(function* (
  options)
  {
    const metroServer = yield runMetro({
      config: options.config,
      maxWorkers: options.maxWorkers,
      port: options.port,
      projectRoots: options.projectRoots,
      resetCache: options.resetCache,
      watch: true });


    const normalizedConfig = options.config ?
    Config.normalize(options.config) :
    Config.DEFAULT;

    return {
      attachHmrServer(httpServer) {
        attachWebsocketServer({
          httpServer,
          path: '/hot',
          websocketServer: new MetroHmrServer(metroServer) });

      },
      metroServer,
      middleware: normalizedConfig.enhanceMiddleware(metroServer.processRequest),
      end() {
        metroServer.end();
      } };

  });return function (_x3) {return _ref4.apply(this, arguments);};})();












exports.runServer = (() => {var _ref5 = _asyncToGenerator(function* (options) {
    const port = options.port || 8080;
    const reporter =
    options.reporter || new TerminalReporter(new Terminal(process.stdout));

    // Lazy require
    const connect = require('connect');

    const serverApp = connect();var _ref6 =





    yield exports.createConnectMiddleware({
      config: options.config,
      maxWorkers: options.maxWorkers,
      port,
      projectRoots: options.projectRoots,
      reporter,
      resetCache: options.resetCache });const attachHmrServer = _ref6.attachHmrServer,middleware = _ref6.middleware,end = _ref6.end;


    serverApp.use(middleware);

    let httpServer;

    if (options.secure) {
      httpServer = Https.createServer(
      {
        key: yield readFile(options.secureKey),
        cert: yield readFile(options.secureCert) },

      serverApp);

    } else {
      httpServer = Http.createServer(serverApp);
    }

    if (options.hmrEnabled) {
      attachHmrServer(httpServer);
    }

    httpServer.listen(port, options.host, function () {
      options.onReady && options.onReady(httpServer);
    });

    // Disable any kind of automatic timeout behavior for incoming
    // requests in case it takes the packager more than the default
    // timeout of 120 seconds to respond to a request.
    httpServer.timeout = 0;

    httpServer.on('error', function (error) {
      end();
    });

    httpServer.on('close', function () {
      end();
    });

    return httpServer;
  });return function (_x4) {return _ref5.apply(this, arguments);};})();












exports.runBuild = (() => {var _ref7 = _asyncToGenerator(function* (options) {
    const metroServer = yield runMetro({
      config: options.config,
      maxWorkers: options.maxWorkers,
      projectRoots: options.projectRoots,
      resetCache: options.resetCache });


    const requestOptions = {
      dev: options.dev,
      entryFile: options.entry,
      inlineSourceMap: options.sourceMap && !!options.sourceMapUrl,
      minify: options.optimize || false,
      platform: options.platform || `web`,
      sourceMapUrl: options.sourceMapUrl,
      createModuleIdFactory: options.config ?
      options.config.createModuleIdFactory :
      undefined };


    const metroBundle = yield MetroBundler.build(metroServer, requestOptions);

    const outputOptions = {
      bundleOutput: options.out.replace(/(\.js)?$/, '.js'),
      sourcemapOutput: options.out.replace(/(\.js)?$/, '.map'),
      dev: options.dev,
      platform: options.platform || `web` };


    yield MetroBundler.save(metroBundle, outputOptions, console.log);
    yield metroServer.end();

    return { metroServer, metroBundle };
  });return function (_x5) {return _ref7.apply(this, arguments);};})();

exports.Config = Config;
exports.defaults = defaults;

// The symbols below belong to the legacy API and should not be relied upon
Object.assign(exports, require('./legacy'));