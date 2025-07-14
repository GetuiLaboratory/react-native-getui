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

const babel = require('babel-core');











module.exports.transform = (_ref) => {let filename = _ref.filename,options = _ref.options,plugins = _ref.plugins,src = _ref.src;
  const OLD_BABEL_ENV = process.env.BABEL_ENV;
  process.env.BABEL_ENV = options.dev ? 'development' : 'production';

  try {var _babel$transform =
    babel.transform(src, { filename, code: false, plugins });const ast = _babel$transform.ast;

    return { ast };
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV;
  }
};