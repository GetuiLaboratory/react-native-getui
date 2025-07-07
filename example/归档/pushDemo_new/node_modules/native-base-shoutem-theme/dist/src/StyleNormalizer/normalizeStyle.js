Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};exports.default=












normalizeStyle;var _lodash=require("lodash");var _lodash2=_interopRequireDefault(_lodash);var _StyleNormalizer=require("./StyleNormalizer");var _StyleNormalizer2=_interopRequireDefault(_StyleNormalizer);var _reactNative=require("react-native");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var styleNormalizer=new _StyleNormalizer2.default();function normalizeStyle(style){
return _lodash2.default.reduce(
style,
function(normalizedStyle,val,prop){

if(_lodash2.default.isPlainObject(val)){
normalizedStyle[prop]=normalizeStyle(val);
}else if(styleNormalizer.canNormalize(prop)){
normalizedStyle=_extends({},
normalizedStyle,
styleNormalizer.normalize(prop,val));

}else{
normalizedStyle[prop]=val;
}


return normalizedStyle;
},
{});

}
//# sourceMappingURL=normalizeStyle.js.map