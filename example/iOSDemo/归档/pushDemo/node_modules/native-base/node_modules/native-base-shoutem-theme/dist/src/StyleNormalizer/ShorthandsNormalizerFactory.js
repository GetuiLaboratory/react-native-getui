Object.defineProperty(exports,"__esModule",{value:true});exports.BOTTOM_LEFT=exports.TOP_LEFT=exports.BOTTOM_RIGHT=exports.TOP_RIGHT=exports.BOTTOM=exports.TOP=exports.RIGHT=exports.LEFT=exports.VERTICAL=exports.HORIZONTAL=exports.CORNERS=exports.SIDES=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _lodash=require('lodash');var _lodash2=_interopRequireDefault(_lodash);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var createShorthand=function createShorthand(name,type){return{name:name,type:_lodash2.default.isUndefined(type)?name:type};};

var SIDES=exports.SIDES=createShorthand('Sides','');
var CORNERS=exports.CORNERS=createShorthand('Corners','');
var HORIZONTAL=exports.HORIZONTAL=createShorthand('Horizontal');
var VERTICAL=exports.VERTICAL=createShorthand('Vertical');

var LEFT=exports.LEFT='Left';
var RIGHT=exports.RIGHT='Right';
var TOP=exports.TOP='Top';
var BOTTOM=exports.BOTTOM='Bottom';
var TOP_RIGHT=exports.TOP_RIGHT='TopRight';
var BOTTOM_RIGHT=exports.BOTTOM_RIGHT='BottomRight';
var TOP_LEFT=exports.TOP_LEFT='TopLeft';
var BOTTOM_LEFT=exports.BOTTOM_LEFT='BottomLeft';var






ShorthandsNormalizerFactory=function(){
function ShorthandsNormalizerFactory(){var _createNormalizersMap;_classCallCheck(this,ShorthandsNormalizerFactory);
this.createNormalizersMap=(_createNormalizersMap={},_defineProperty(_createNormalizersMap,
SIDES.name,this.createAllSidesNormalizer),_defineProperty(_createNormalizersMap,
CORNERS.name,this.createAllCornersNormalizer),_defineProperty(_createNormalizersMap,
HORIZONTAL.name,this.createHorizontalSidesNormalizer),_defineProperty(_createNormalizersMap,
VERTICAL.name,this.createVerticalSidesNormalizer),_createNormalizersMap);

}_createClass(ShorthandsNormalizerFactory,[{key:'createAllSidesNormalizer',value:function createAllSidesNormalizer(

prop,shorthand){var suffix=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';
return function(val){var _ref;return _ref={},_defineProperty(_ref,
prop+LEFT+suffix,val),_defineProperty(_ref,
prop+RIGHT+suffix,val),_defineProperty(_ref,
prop+TOP+suffix,val),_defineProperty(_ref,
prop+BOTTOM+suffix,val),_ref;};

}},{key:'createAllCornersNormalizer',value:function createAllCornersNormalizer(

prop,shorthand){var suffix=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';
return function(val){var _ref2;return _ref2={},_defineProperty(_ref2,
prop+BOTTOM_LEFT+suffix,val),_defineProperty(_ref2,
prop+BOTTOM_RIGHT+suffix,val),_defineProperty(_ref2,
prop+TOP_LEFT+suffix,val),_defineProperty(_ref2,
prop+TOP_RIGHT+suffix,val),_ref2;};

}},{key:'createHorizontalSidesNormalizer',value:function createHorizontalSidesNormalizer(

prop){
return function(val){var _ref3;return _ref3={},_defineProperty(_ref3,
prop+LEFT,val),_defineProperty(_ref3,
prop+RIGHT,val),_ref3;};

}},{key:'createVerticalSidesNormalizer',value:function createVerticalSidesNormalizer(

prop){
return function(val){var _ref4;return _ref4={},_defineProperty(_ref4,
prop+TOP,val),_defineProperty(_ref4,
prop+BOTTOM,val),_ref4;};

}},{key:'getNormalizerCreator',value:function getNormalizerCreator(

shorthand){
return this.createNormalizersMap[shorthand.name];
}},{key:'createNormalizer',value:function createNormalizer(

prop,shorthand,suffix){
var normalizerCreator=this.getNormalizerCreator(shorthand);
return normalizerCreator(prop,shorthand,suffix);
}}]);return ShorthandsNormalizerFactory;}();exports.default=


new ShorthandsNormalizerFactory();
//# sourceMappingURL=ShorthandsNormalizerFactory.js.map