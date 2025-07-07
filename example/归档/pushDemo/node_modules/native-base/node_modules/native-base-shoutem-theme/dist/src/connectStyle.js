Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/connectStyle.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.















clearThemeCache=clearThemeCache;var _react=require('react');var _react2=_interopRequireDefault(_react);var _propTypes=require('prop-types');var _propTypes2=_interopRequireDefault(_propTypes);var _hoistNonReactStatics=require('hoist-non-react-statics');var _hoistNonReactStatics2=_interopRequireDefault(_hoistNonReactStatics);var _lodash=require('lodash');var _=_interopRequireWildcard(_lodash);var _normalizeStyle=require('./StyleNormalizer/normalizeStyle');var _normalizeStyle2=_interopRequireDefault(_normalizeStyle);var _reactNative=require('react-native');var _Theme=require('./Theme');var _Theme2=_interopRequireDefault(_Theme);var _resolveComponentStyle=require('./resolveComponentStyle');function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var themeCache={};function clearThemeCache(){
themeCache={};
}







function throwConnectStyleError(errorMessage,componentDisplayName){
throw Error(
errorMessage+' - when connecting '+componentDisplayName+' component to style.');

}








function getTheme(context){


return context.theme||_Theme2.default.getDefaultTheme();
}










function isStyleVariant(propertyName){
return /^\./.test(propertyName);
}













function isChildStyle(propertyName){
return /(^[^\.].*\.)|^\*$/.test(propertyName);
}

function getConcreteStyle(style){
return _.pickBy(style,function(value,key){
return!isStyleVariant(key)&&!isChildStyle(key);
});
}exports.default=
















function(
componentStyleName)



{var componentStyle=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var mapPropsToStyleNames=arguments[2];var options=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};
function getComponentDisplayName(WrappedComponent){
return WrappedComponent.displayName||WrappedComponent.name||"Component";
}

return function wrapWithStyledComponent(WrappedComponent){
var componentDisplayName=getComponentDisplayName(WrappedComponent);

if(!_.isPlainObject(componentStyle)){
throwConnectStyleError(
"Component style must be plain object",
componentDisplayName);

}

if(!_.isString(componentStyleName)){
throwConnectStyleError(
"Component Style Name must be string",
componentDisplayName);

}var

StyledComponent=function(_React$Component){_inherits(StyledComponent,_React$Component);






































function StyledComponent(props,context){_classCallCheck(this,StyledComponent);var _this=_possibleConstructorReturn(this,(StyledComponent.__proto__||Object.getPrototypeOf(StyledComponent)).call(this,
props,context));

var styleNames=_this.getStyleNames(props);
var style=props.style;

var finalStyle=_this.getFinalStyle(
props,
context,
style,
styleNames);


_this.setWrappedInstance=_this.setWrappedInstance.bind(_this);
_this.resolveConnectedComponentStyle=_this.resolveConnectedComponentStyle.bind(_this);


_this.state={
style:finalStyle,



addedProps:_this.resolveAddedProps(),
styleNames:styleNames};return _this;

}_createClass(StyledComponent,[{key:'getFinalStyle',value:function getFinalStyle(

props,context,style,styleNames){
var resolvedStyle={};
if(context.parentPath){
resolvedStyle=this.getOrSetStylesInCache(
context,
props,
styleNames,[].concat(_toConsumableArray(
context.parentPath),[componentStyleName],_toConsumableArray(styleNames)));

}else{
resolvedStyle=this.resolveStyle(context,props,styleNames);
themeCache[componentStyleName]=resolvedStyle;
}

var concreteStyle=getConcreteStyle(_.merge({},resolvedStyle));

if(_.isArray(style)){
return[concreteStyle].concat(_toConsumableArray(style));
}

if(typeof style=="number"||typeof style=="object"){
return[concreteStyle,style];
}

return concreteStyle;
}},{key:'getStyleNames',value:function getStyleNames(

props){
var styleNamesArr=_.map(props,function(value,key){
if(typeof value!=="object"&&value===true){
return"."+key;
}else{
return false;
}
});
_.remove(styleNamesArr,function(value,index){
return value===false;
});

return styleNamesArr;
}},{key:'getParentPath',value:function getParentPath()

{
if(!this.context.parentPath){
return[componentStyleName];
}else{
return[].concat(_toConsumableArray(
this.context.parentPath),[
componentStyleName],_toConsumableArray(
this.getStyleNames(this.props)));

}
}},{key:'getChildContext',value:function getChildContext()

{
return{




parentPath:this.getParentPath()};

}},{key:'UNSAFE_componentWillReceiveProps',value:function UNSAFE_componentWillReceiveProps(

nextProps,nextContext){
var styleNames=this.getStyleNames(nextProps);
var style=nextProps.style;
if(this.shouldRebuildStyle(nextProps,nextContext,styleNames)){
var finalStyle=this.getFinalStyle(
nextProps,
nextContext,
style,
styleNames);


this.setState({
style:finalStyle,

styleNames:styleNames});

}
}},{key:'setNativeProps',value:function setNativeProps(

nativeProps){
if(this.wrappedInstance.setNativeProps){
this.wrappedInstance.setNativeProps(nativeProps);
}
}},{key:'setWrappedInstance',value:function setWrappedInstance(

component){
if(component&&component._root){
this._root=component._root;
}else{
this._root=component;
}
this.wrappedInstance=this._root;
}},{key:'hasStyleNameChanged',value:function hasStyleNameChanged(

nextProps,styleNames){
return(
mapPropsToStyleNames&&
this.props!==nextProps&&


!_.isEqual(this.state.styleNames,styleNames));

}},{key:'shouldRebuildStyle',value:function shouldRebuildStyle(

nextProps,nextContext,styleNames){
return(
nextProps.style!==this.props.style||
nextProps.styleName!==this.props.styleName||
nextContext.theme!==this.context.theme||
!_.isEqual(nextContext.parentPath,this.context.parentPath)||
this.hasStyleNameChanged(nextProps,styleNames));

}},{key:'resolveStyleNames',value:function resolveStyleNames(

props){var
styleName=props.styleName;
var styleNames=styleName?styleName.split(/\s/g):[];

if(!mapPropsToStyleNames){
return styleNames;
}


return _.uniq(mapPropsToStyleNames(styleNames,props));
}},{key:'resolveAddedProps',value:function resolveAddedProps()

{
var addedProps={};
if(options.withRef){
addedProps.ref="wrappedInstance";
}
return addedProps;
}},{key:'getOrSetStylesInCache',value:function getOrSetStylesInCache(

context,props,styleNames,path){
if(themeCache&&themeCache[path.join(">")]){


return themeCache[path.join(">")];
}else{
var resolvedStyle=this.resolveStyle(context,props,styleNames);
if(Object.keys(themeCache).length<10000){
themeCache[path.join(">")]=resolvedStyle;
}
return resolvedStyle;
}
}},{key:'resolveStyle',value:function resolveStyle(

context,props,styleNames){
var parentStyle={};

var theme=getTheme(context);
var themeStyle=theme.createComponentStyle(
componentStyleName,
componentStyle);


if(context.parentPath){
parentStyle=themeCache[context.parentPath.join(">")];
}else{
parentStyle=(0,_resolveComponentStyle.resolveComponentStyle)(
componentStyleName,
styleNames,
themeStyle,
parentStyle);

}

return(0,_resolveComponentStyle.resolveComponentStyle)(
componentStyleName,
styleNames,
themeStyle,
parentStyle);

}},{key:'resolveConnectedComponentStyle',value:function resolveConnectedComponentStyle(








props){
var styleNames=this.resolveStyleNames(props);
return this.resolveStyle(this.context,props,styleNames).
componentStyle;
}},{key:'render',value:function render()

{var _state=







this.state,addedProps=_state.addedProps,style=_state.style;
return(
_react2.default.createElement(WrappedComponent,_extends({},
this.props,
addedProps,{
style:style,
ref:this.setWrappedInstance,__source:{fileName:_jsxFileName,lineNumber:392}})));


}}]);return StyledComponent;}(_react2.default.Component);StyledComponent.contextTypes={theme:_Theme.ThemeShape,parentPath:_propTypes2.default.array};StyledComponent.childContextTypes={parentPath:_propTypes2.default.array};StyledComponent.propTypes={style:_propTypes2.default.oneOfType([_propTypes2.default.object,_propTypes2.default.number,_propTypes2.default.array]),styleName:_propTypes2.default.string,virtual:_propTypes2.default.bool};StyledComponent.defaultProps={virtual:options.virtual};StyledComponent.displayName='Styled('+componentDisplayName+')';StyledComponent.WrappedComponent=WrappedComponent;


return(0,_hoistNonReactStatics2.default)(StyledComponent,WrappedComponent);
};
};
//# sourceMappingURL=connectStyle.js.map