Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _ShorthandsNormalizerFactory=require('./ShorthandsNormalizerFactory');var _ShorthandsNormalizerFactory2=_interopRequireDefault(_ShorthandsNormalizerFactory);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var









StyleNormalizer=function(){
function StyleNormalizer(){_classCallCheck(this,StyleNormalizer);
this.normalizers={};
this.createNormalizers('margin',[_ShorthandsNormalizerFactory.HORIZONTAL,_ShorthandsNormalizerFactory.VERTICAL,_ShorthandsNormalizerFactory.SIDES]);
this.createNormalizers('padding',[_ShorthandsNormalizerFactory.HORIZONTAL,_ShorthandsNormalizerFactory.VERTICAL,_ShorthandsNormalizerFactory.SIDES]);
this.createNormalizers('border',[_ShorthandsNormalizerFactory.SIDES],'Width');
}_createClass(StyleNormalizer,[{key:'createNormalizers',value:function createNormalizers(

prop,shorthands){var _this=this;var suffix=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';
shorthands.forEach(function(shorthand){
var propName=prop+shorthand.type+suffix;

if(_this.normalizerExists(propName)){
throw Error('Normalizer for \''+propName+'\' shorthand already exists');
}

_this.normalizers[propName]=
_ShorthandsNormalizerFactory2.default.createNormalizer(prop,shorthand,suffix);
});
}},{key:'normalizerExists',value:function normalizerExists(

normalizerName){
return!!this.normalizers[normalizerName];
}},{key:'canNormalize',value:function canNormalize(

prop){
return this.normalizerExists(prop);
}},{key:'normalize',value:function normalize(

prop,val){
return this.normalizers[prop](val);
}}]);return StyleNormalizer;}();exports.default=StyleNormalizer;
//# sourceMappingURL=StyleNormalizer.js.map