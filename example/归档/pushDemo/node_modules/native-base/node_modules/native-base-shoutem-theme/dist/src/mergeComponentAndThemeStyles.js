Object.defineProperty(exports,"__esModule",{value:true});exports.default=

mergeComponentAndThemeStyles;var _lodash=require('lodash');var _=_interopRequireWildcard(_lodash);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function mergeComponentAndThemeStyles(
componentStyle,themeComponentStyle,themeStyle){
var componentThemedStyle=_.merge({},componentStyle,themeComponentStyle);



var intersectedRootThemeStyle=_.pick(themeStyle,_.keys(componentThemedStyle));


return _.merge({},intersectedRootThemeStyle,componentThemedStyle);
}
//# sourceMappingURL=mergeComponentAndThemeStyles.js.map