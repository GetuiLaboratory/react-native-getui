import {
	AppRegistry,
	NativeModules,
	Platform,
	DeviceEventEmitter
} from 'react-native';

const GetuiModule = NativeModules.GetuiModule;

AppRegistry.registerHeadlessTask(HEADLESS_TASK, () => headlessJsTask);

/**
 * Logs message to console with the [Getui] prefix
 * @param  {string} message
 */
const log = (message) => {
		console.log(`[Getui] ${message}`);
	}
	// is function
const isFunction = (fn) => typeof fn === 'function';
/**
 * create a safe fn env
 * @param  {any} fn
 * @param  {any} success
 * @param  {any} error
 */
const safeCallback = (fn, success, error) => {

	GetuiModule[fn](function(params) {
		log(params);
		isFunction(success) && success(params)
	}, function(error) {
		log(error)
		isFunction(error) && error(error)
	})

}
