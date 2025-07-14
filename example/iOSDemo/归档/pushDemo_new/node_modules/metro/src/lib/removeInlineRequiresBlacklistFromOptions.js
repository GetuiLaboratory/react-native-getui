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

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};



function removeInlineRequiresBlacklistFromOptions(
path,
transformOptions)
{
  if (typeof transformOptions.inlineRequires === 'object') {
    // $FlowIssue #23854098 - Object.assign() loses the strictness of an object in flow
    return _extends({},
    transformOptions, {
      inlineRequires: !(path in transformOptions.inlineRequires.blacklist) });

  }

  return transformOptions;
}

module.exports = removeInlineRequiresBlacklistFromOptions;