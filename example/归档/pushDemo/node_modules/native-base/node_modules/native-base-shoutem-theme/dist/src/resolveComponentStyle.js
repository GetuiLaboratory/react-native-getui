Object.defineProperty(exports,"__esModule",{value:true});exports.




















































































resolveComponentStyle=resolveComponentStyle;var _lodash=require("lodash");var _lodash2=_interopRequireDefault(_lodash);var _customMerge=require("./customMerge");var _customMerge2=_interopRequireDefault(_customMerge);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function isStyleVariant(propertyName){return /^\./.test(propertyName);}function isChildStyle(propertyName){return /(^[^\.].*\.)|^\*$/.test(propertyName);}function splitStyle(style){return _lodash2.default.reduce(style,function(result,value,key){var styleSection=result.componentStyle;if(isStyleVariant(key)){styleSection=result.styleVariants;}else if(isChildStyle(key)){styleSection=result.childrenStyle;}styleSection[key]=value;return result;},{componentStyle:{},styleVariants:{},childrenStyle:{}});}function resolveComponentStyle(
componentName)




{var styleNames=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];var themeStyle=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};var parentStyle=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};var themeCache=arguments[4];









var mergedStyle=(0,_customMerge2.default)(themeStyle,parentStyle[componentName]);
styleNames.forEach(function(sn,index){
mergedStyle=(0,_customMerge2.default)(mergedStyle,themeStyle[""+sn]);
});

styleNames.forEach(function(sn,index){
mergedStyle=(0,_customMerge2.default)(
mergedStyle,
parentStyle[""+componentName+sn]);

});













var resolvedStyle=(0,_customMerge2.default)(mergedStyle,parentStyle[componentName]);

styleNames.forEach(function(sn,index){
resolvedStyle=(0,_customMerge2.default)(resolvedStyle,mergedStyle[""+sn]);
});

styleNames.forEach(function(sn,index){
resolvedStyle=(0,_customMerge2.default)(
resolvedStyle,
parentStyle[""+componentName+sn]);

});

return resolvedStyle;
}
//# sourceMappingURL=resolveComponentStyle.js.map