Object.defineProperty(exports,"__esModule",{value:true});exports.ThemeShape=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _propTypes=require("prop-types");
var _resolveIncludes=require("./resolveIncludes");var _resolveIncludes2=_interopRequireDefault(_resolveIncludes);
var _mergeComponentAndThemeStyles=require("./mergeComponentAndThemeStyles");var _mergeComponentAndThemeStyles2=_interopRequireDefault(_mergeComponentAndThemeStyles);
var _normalizeStyle=require("./StyleNormalizer/normalizeStyle");var _normalizeStyle2=_interopRequireDefault(_normalizeStyle);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}


var THEME_STYLE="@@shoutem.theme/themeStyle";
var THEME_STYLE_CACHE="@@shoutem.theme/themeCachedStyle";

var defaultTheme=void 0;

var resolveStyle=function resolveStyle(style,baseStyle){return(
(0,_normalizeStyle2.default)((0,_resolveIncludes2.default)(style,baseStyle)));};var

























Theme=function(){
function Theme(themeStyle){_classCallCheck(this,Theme);
this[THEME_STYLE]=resolveStyle(themeStyle);
this[THEME_STYLE_CACHE]={};
}_createClass(Theme,[{key:"createComponentStyle",value:function createComponentStyle(































componentName,defaultStyle){
if(this[THEME_STYLE_CACHE][componentName]){
return this[THEME_STYLE_CACHE][componentName];
}

var componentIncludedStyle=resolveStyle(
defaultStyle,
this[THEME_STYLE]);







this[THEME_STYLE_CACHE][componentName]=(0,_mergeComponentAndThemeStyles2.default)(
componentIncludedStyle,
this[THEME_STYLE][componentName],
this[THEME_STYLE]);


return this[THEME_STYLE_CACHE][componentName];
}}],[{key:"setDefaultThemeStyle",value:function setDefaultThemeStyle(style){defaultTheme=new Theme(style);}},{key:"getDefaultTheme",value:function getDefaultTheme(){if(!defaultTheme){defaultTheme=new Theme({});}return defaultTheme;}}]);return Theme;}();exports.default=Theme;


var ThemeShape=exports.ThemeShape=_propTypes.PropTypes.shape({
createComponentStyle:_propTypes.PropTypes.func.isRequired});
//# sourceMappingURL=Theme.js.map