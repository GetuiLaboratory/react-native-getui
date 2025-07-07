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

const DependencyGraph = require('../node-haste/DependencyGraph');

const defaults = require('../defaults');var _require =





require('metro-source-map');const compactMapping = _require.compactMapping,fromRawMappings = _require.fromRawMappings,toRawMappings = _require.toRawMappings;
const pathJoin = require('path').join;





































class Resolver {






  constructor(opts, depGraph) {
    this._getPolyfills = opts.getPolyfills;
    this._minifyCode = opts.minifyCode;
    this._postMinifyProcess = opts.postMinifyProcess;
    this._polyfillModuleNames = opts.polyfillModuleNames || [];
    this._depGraph = depGraph;
  }

  static load(opts) {return _asyncToGenerator(function* () {
      const depGraph = yield DependencyGraph.load({
        assetDependencies: [opts.assetRegistryPath],
        assetExts: opts.assetExts,
        extraNodeModules: opts.extraNodeModules,
        forceNodeFilesystemAPI: false,
        getTransformCacheKey: opts.getTransformCacheKey,
        globalTransformCache: opts.globalTransformCache,
        hasteImpl: opts.hasteImpl,
        ignorePattern: opts.blacklistRE || / ^/ /* matches nothing */,
        maxWorkers: opts.maxWorkers,
        platforms: opts.platforms,
        preferNativePlatform: true,
        providesModuleNodeModules: opts.providesModuleNodeModules,
        reporter: opts.reporter,
        resetCache: opts.resetCache,
        roots: opts.projectRoots,
        sourceExts: opts.sourceExts,
        transformCache: opts.transformCache,
        transformCode: opts.transformCode,
        useWatchman: true,
        watch: opts.watch });

      return new Resolver(opts, depGraph);})();
  }

  getModuleSystemDependencies(_ref) {var _ref$dev = _ref.dev;let dev = _ref$dev === undefined ? true : _ref$dev;
    const prelude = dev ?
    pathJoin(__dirname, 'polyfills/prelude_dev.js') :
    pathJoin(__dirname, 'polyfills/prelude.js');

    const moduleSystem = defaults.moduleSystem;

    return [prelude, moduleSystem].map(moduleName =>
    this._depGraph.createPolyfill({
      file: moduleName,
      id: moduleName,
      dependencies: [] }));


  }

  minifyModule(
  path,
  code,
  map)
  {var _this = this;return _asyncToGenerator(function* () {
      const sourceMap = fromRawMappings([{ code, source: code, map, path }]).toMap(
      undefined,
      {});


      const minified = yield _this._minifyCode(path, code, sourceMap);
      const result = yield _this._postMinifyProcess(_extends({}, minified));

      return {
        code: result.code,
        map: result.map ? toRawMappings(result.map).map(compactMapping) : [] };})();

  }

  getDependencyGraph() {
    return this._depGraph;
  }}


module.exports = Resolver;