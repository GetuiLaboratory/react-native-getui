Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};exports.




































createVariations=createVariations;exports.












































createSharedStyle=createSharedStyle;var _lodash=require('lodash');var _lodash2=_interopRequireDefault(_lodash);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}function capitalizeFirstLetter(value){return value.charAt(0).toUpperCase()+value.slice(1);}function createVariations(baseName,nameSuffixes,key,value){return _lodash2.default.reduce(nameSuffixes,function(result,variant){var variantName=variant?baseName+'-'+variant:baseName;var keyName=variant?''+key+capitalizeFirstLetter(variant):key;result[variantName]=_defineProperty({},keyName,value);return result;},{});}function createSharedStyle(componentNames){var sharedStyle=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var customStyles=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};
return _lodash2.default.reduce(componentNames,function(result,componentName){

result[componentName]=_extends({},
sharedStyle,
customStyles[componentName]);


return result;
},{});
}
//# sourceMappingURL=addons.js.map