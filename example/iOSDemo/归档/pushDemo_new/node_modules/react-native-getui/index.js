import {
	NativeModules,
	Platform
} from 'react-native';

const GetuiModule = NativeModules.GetuiModule;

/**
 * Logs message to console with the [Getui] prefix
 * @param  {string} message
 */
const log = (message) => {
		console.log(`[Getui] ${message}`);
}

export default class Getui {
	//监听消息通知
			// var { NativeAppEventEmitter } = require('react-native');
			// var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
			// 	 'receiveRemoteNotification',
			// 	 (notification) => {
			// 		 //消息类型分为 APNs 和 payload 透传消息，具体的消息体格式会有差异
			// 		 switch (notification.type) {
			// 				 case "apns":
			// 						 Alert.alert('APNs 消息通知',JSON.stringify(notification))
			// 						 break;
			// 				 case "payload":
			// 						 Alert.alert('payload 消息通知',JSON.stringify(notification))
			// 						 break;
			// 				 default:
			// 		 }
			// 	 }
			//  );
			//
			//  var clickRemoteNotificationSub = NativeAppEventEmitter.addListener(
			// 		 'clickRemoteNotification',
			// 		 (notification) => {
			// 				 Alert.alert('点击通知',JSON.stringify(notification))
			// 		 }
			//  );
			//
			// //记得在 componentWillUnMount 移除监听
	    //     receiveRemoteNotificationSub.remove()
	    //     clickRemoteNotificationSub.remove()

    /**
	 * 初始化推送服务
     */
    static initPush(){
    	GetuiModule.initPush();
	}
	/**
	 *  销毁SDK，并且释放资源
	 */
	static destroy() {
		GetuiModule.destroy();
	}
	/**
	 *  恢复SDK运行,IOS7 以后支持Background Fetch方式，后台定期更新数据,该接口需要在Fetch起来后被调用，保证SDK 数据获取。
	 */
	static resume() {
		GetuiModule.resume();
	}

	static turnOnPush() {
		GetuiModule.turnOnPush();
	}

	static turnOffPush() {
		GetuiModule.turnOffPush();
	}

	/**
	 *  获取SDK的Cid
	 *
	 *  @return Cid值
	 */
	static clientId(cb) {
		GetuiModule.clientId((param)=>{
			cb(param)
		});
	}
	/**
	 *  获取SDK运行状态
	 *
	 *  @return 运行状态
	 */
	static status(cb) {
		GetuiModule.status((param)=>{
			cb(param)
		});
	}
	/**
	 *  获取SDK版本号
	 *
	 *  @return 版本值
	 */
	static version(cb) {
		GetuiModule.version((param)=>{
			cb(param)
		});
	}
	/**
	 *  是否允许SDK 后台运行（默认值：NO）
	 *  备注：可以未启动SDK就调用该方法
	 *  警告：该功能会和音乐播放冲突，使用时请注意
	 *
	 *  @param isEnable 支持当APP进入后台后，个推是否运行,YES.允许
	 */
	static runBackgroundEnable(isEnable) {
		GetuiModule.runBackgroundEnable(isEnable);
	}
/**
 *  地理围栏功能，设置地理围栏是否运行
 *  备注：SDK可以未启动就调用该方法
 *
 *  @param isEnable 设置地理围栏功能是否运行（默认值：NO）
 *  @param isVerify 设置是否SDK主动弹出用户定位请求（默认值：NO）
 */
	static lbsLocationEnable(isEnable, isVerify) {
		GetuiModule.lbsLocationEnable(isEnable, isVerify);
	}
	/**
	 *  设置渠道
	 *  备注：SDK可以未启动就调用该方法
	 *
	 *  SDK-1.5.0+
	 *
	 *  @param aChannelId 渠道值，可以为空值
	 */

	static setChannelId(aChannelId) {
		GetuiModule.setChannelId(aChannelId);
	}
	/**
	 *  向个推服务器注册DeviceToken
	 *  备注：可以未启动SDK就调用该方法
	 *
	 *  @param deviceToken 推送时使用的deviceToken
	 *
	 */
	static registerDeviceToken(deviceToken) {
		GetuiModule.registerDeviceToken(deviceToken);
	}
	/**
	 *  绑定别名功能:后台可以根据别名进行推送
	 *
	 *  @param alias 别名字符串
	 *  @param aSn   绑定序列码, 不为nil
	 */

	static bindAlias(alias, aSn = '0') {
		GetuiModule.bindAlias(alias, aSn);
	}
	/**
	 *  取消绑定别名功能
	 *
	 *  @param alias 别名字符串
	 *  @param aSn   绑定序列码, 不为nil
	 */
	static unbindAlias(alias, aSn = '0') {
		GetuiModule.unbindAlias(alias, aSn);
	}
	/**
	 *  给用户打标签 , 后台可以根据标签进行推送
	 *
	 *  @param tags 别名数组
	 *
	 *  @return 提交结果，YES表示尝试提交成功，NO表示尝试提交失败
	 */
	static setTag(tags) {
		GetuiModule.setTag(tags);
	}
	/**
	 *  设置关闭推送模式（默认值：NO）
	 *
	 *  @param isValue 消息推送开发，YES.关闭消息推送 NO.开启消息推送
	 *
	 *  SDK-1.2.1+
	 *
	 */
	static setPushModeForOff(isValue) {
		GetuiModule.setPushModeForOff(isValue);
	}

	 /**
 	 *  同步角标值到个推服务器
 	 *  该方法只是同步角标值到个推服务器，本地仍须调用setApplicationIconBadgeNumber函数
 	 *
 	 *  SDK-1.4.0+
 	 *
 	 *  @param value 角标数值
 	 */
	static setBadge(value) {
		GetuiModule.setBadge(value);
	}

	static resetBadge() {
		GetuiModule.resetBadge();
	}
	/**
	 *  SDK发送上行消息结果
	 *
	 *  @param body  需要发送的消息数据
	 *  @param error 如果发送成功返回messageid，发送失败返回nil
	 *
	 *  @return 消息的msgId
	 */
	static sendMessage(body, error) {
		GetuiModule.sendMessage(body, error);
	}
	/**
	 *  上行第三方自定义回执actionid
	 *
	 *  @param actionId 用户自定义的actionid，int类型，取值90001-90999。
	 *  @param taskId   下发任务的任务ID
	 *  @param msgId    下发任务的消息ID
	 *
	 *  @return BOOL，YES表示尝试提交成功，NO表示尝试提交失败。注：该结果不代表服务器收到该条数据
	 *  该方法需要在回调方法“GeTuiSdkDidReceivePayload:andTaskId:andMessageId:andOffLine:fromApplication:”使用
	 */
	static sendFeedbackMessage(actionId, taskId, msgId, cb) {
		GetuiModule.sendFeedbackMessage(actionId, taskId, msgId, (param)=>{
			cb(param)
		});
	}

	/**
	 *  向个推服务器注册 VoIP
	 *  备注：可以未启动SDK就调用该方法
	 *	iOS 可用
	 *
	 */
	static voipRegistration() {
		GetuiModule.voipRegistration();
	}

	/*****************  deprecated ******************/
	/*
	*  React-native 只能 callback 一次，因此移除该形式，改用订阅模式监听消息
	 *  收到消息通知的回调
	 */
	// static receiveRemoteNotification(cb){
	// 	GetuiModule.receiveRemoteNotification((param)=>{
	// 		cb(param)
	// 	})
	// }
	/**
	*  React-native 只能 callback 一次，因此移除该形式，改用订阅模式监听消息
	 *  点击通知的回调，iOS10 以后才有该方法
	 */
	// static clickRemoteNotification(cb){
	// 	GetuiModule.clickRemoteNotification((param)=>{
	// 		cb(param)
	// 	})
	// }

}
