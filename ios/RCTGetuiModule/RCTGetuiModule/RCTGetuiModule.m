//
//  RCTGetuiModule.m
//  RCTGetuiModule
//
//  Created by admin on 17/2/27.
//  Copyright © 2017年 getui. All rights reserved.
//

#import "RCTGetuiModule.h"

#if __has_include(<React/RCTBridge.h>)
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#import <React/RCTLog.h>

#elif __has_include("RCTBridge.h")
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#import "RCTLog.h"
#elif __has_include("React/RCTBridge.h")
#import "React/RCTEventDispatcher.h"
#import "React/RCTRootView.h"
#import "React/RCTBridge.h"
#import "React/RCTLog.h"
#endif


@interface RCTGetuiModule () {
    RCTResponseSenderBlock receiveRemoteNotificationCallback;
    RCTResponseSenderBlock clickNotificationCallback;

}

@end
@implementation RCTGetuiModule

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];

        [defaultCenter removeObserver:self];

        [defaultCenter addObserver:self
                          selector:@selector(noti_receiveRemoteNotification:)
                              name:GT_DID_RECEIVE_REMOTE_NOTIFICATION
                            object:nil];
        [defaultCenter addObserver:self
                          selector:@selector(noti_clickRemoteNotification:)
                              name:GT_DID_CLICK_NOTIFICATION
                            object:nil];
        [defaultCenter addObserver:self
                          selector:@selector(noti_registeClientId:)
                              name:GT_DID_REGISTE_CLIENTID
                            object:nil];
    }
    return self;
}

- (void)noti_receiveRemoteNotification:(NSNotification *)notification {
    id obj = [notification object];
//    if(receiveRemoteNotificationCallback)
//        receiveRemoteNotificationCallback(@[obj]);
    [self.bridge.eventDispatcher sendAppEventWithName:@"receiveRemoteNotification"
                                                 body:obj];
}

-(void)noti_registeClientId:(NSNotification *)notification {
  id obj = [notification object];
  [self.bridge.eventDispatcher sendAppEventWithName:@"registeClientId"
                                               body:obj];
}

// iOS 10 后才有点击事件的回调
- (void)noti_clickRemoteNotification:(NSNotification *)notification {
    id obj = [notification object];
//    if (clickNotificationCallback) {
//        clickNotificationCallback(@[obj]);
//    }
    [self.bridge.eventDispatcher sendAppEventWithName:@"clickRemoteNotification"
                                                 body:obj];
}

#pragma mark - 收到通知回调

//RCT_EXPORT_METHOD(receiveRemoteNotification:(RCTResponseSenderBlock)callback)
//{
//    receiveRemoteNotificationCallback = callback;
//}
///*
// *点击回调传回的消息格式只为 APNs
// */
//RCT_EXPORT_METHOD(clickRemoteNotification:(RCTResponseSenderBlock)callback)
//{
//    clickNotificationCallback = callback;
//}

/**
 *  销毁SDK，并且释放资源
 */

RCT_EXPORT_METHOD(destroy)
{
    [GeTuiSdk destroy];
}

/**
 *  恢复SDK运行,IOS7 以后支持Background Fetch方式，后台定期更新数据,该接口需要在Fetch起来后被调用，保证SDK 数据获取。
 */

RCT_EXPORT_METHOD(resume)
{
    [GeTuiSdk resume];
}
/**
 *  获取SDK的Cid
 *
 *  @return Cid值
 */
RCT_EXPORT_METHOD(clientId:(RCTResponseSenderBlock)callback)
{
    NSString *clientId = [GeTuiSdk clientId]?:@"";
    callback(@[clientId]);
}
/**
 *  获取SDK运行状态
 *
 *  @return 运行状态
 */
RCT_EXPORT_METHOD(status:(RCTResponseSenderBlock)callback)
{
    callback(@[[NSString stringWithFormat:@"%d",[GeTuiSdk status]]]);
}

/**
 *  获取SDK版本号
 *
 *  @return 版本值
 */
RCT_EXPORT_METHOD(version:(RCTResponseSenderBlock)callback)
{
    callback(@[[GeTuiSdk version]]);
}

#pragma mark -
/**
 *  是否允许SDK 后台运行（默认值：NO）
 *  备注：可以未启动SDK就调用该方法
 *  警告：该功能会和音乐播放冲突，使用时请注意
 *
 *  @param isEnable 支持当APP进入后台后，个推是否运行,YES.允许
 */
RCT_EXPORT_METHOD(runBackgroundEnable:(BOOL)isEnable)
{
    [GeTuiSdk runBackgroundEnable:isEnable];
}
/**
 *  地理围栏功能，设置地理围栏是否运行
 *  备注：SDK可以未启动就调用该方法
 *
 *  @param isEnable 设置地理围栏功能是否运行（默认值：NO）
 *  @param isVerify 设置是否SDK主动弹出用户定位请求（默认值：NO）
 */
RCT_EXPORT_METHOD(lbsLocationEnable:(BOOL)isEnable andUserVerify:(BOOL)isVerify)
{
    [GeTuiSdk lbsLocationEnable:isEnable andUserVerify:isVerify];
}

#pragma mark -

/**
 *  设置渠道
 *  备注：SDK可以未启动就调用该方法
 *
 *  SDK-1.5.0+
 *
 *  @param aChannelId 渠道值，可以为空值
 */

RCT_EXPORT_METHOD(setChannelId:(NSString *)aChannelId)
{
    [GeTuiSdk setChannelId:aChannelId];
}

/**
 *  向个推服务器注册DeviceToken
 *  备注：可以未启动SDK就调用该方法
 *
 *  @param deviceToken 推送时使用的deviceToken
 *
 */
RCT_EXPORT_METHOD(registerDeviceToken:(NSString *)deviceToken)
{
    [GeTuiSdk registerDeviceToken:deviceToken];
}
/**
 *  绑定别名功能:后台可以根据别名进行推送
 *
 *  @param alias 别名字符串
 *  @param aSn   绑定序列码, 不为nil
 */
RCT_EXPORT_METHOD(bindAlias:(NSString *)alias andSequenceNum:(NSString *)aSn)
{
    [GeTuiSdk bindAlias:alias andSequenceNum:aSn];
}
/**
 *  取消绑定别名功能
 *
 *  @param alias 别名字符串
 *  @param aSn   绑定序列码, 不为nil
 */
RCT_EXPORT_METHOD(unbindAlias:(NSString *)alias andSequenceNum:(NSString *)aSn)
{
    [GeTuiSdk unbindAlias:alias andSequenceNum:aSn andIsSelf:YES];
}
/**
 *  给用户打标签 , 后台可以根据标签进行推送
 *
 *  @param tags 别名数组
 *
 *  @return 提交结果，YES表示尝试提交成功，NO表示尝试提交失败
 */
RCT_EXPORT_METHOD(setTag:(NSArray *)tags)
{
    [GeTuiSdk setTags:tags];
}
/**
 *  设置关闭推送模式（默认值：NO）
 *
 *  @param isValue 消息推送开发，YES.关闭消息推送 NO.开启消息推送
 *
 *  SDK-1.2.1+
 *
 */
RCT_EXPORT_METHOD(setPushModeForOff:(BOOL)isValue)
{
    [GeTuiSdk setPushModeForOff:isValue];
}

/**
 *  同步角标值到个推服务器
 *  该方法只是同步角标值到个推服务器，本地仍须调用setApplicationIconBadgeNumber函数
 *
 *  SDK-1.4.0+
 *
 *  @param value 角标数值
 */

RCT_EXPORT_METHOD(setBadge:(NSUInteger)value)
{
    [GeTuiSdk setBadge:value];
}

RCT_EXPORT_METHOD(resetBadge)
{
    [GeTuiSdk resetBadge];
}

#pragma mark -

/**
 *  SDK发送上行消息结果
 *
 *  @param body  需要发送的消息数据
 *  @param error 如果发送成功返回messageid，发送失败返回nil
 *
 *  @return 消息的msgId
 */
RCT_EXPORT_METHOD(sendMessage:(NSData *)body error:(NSError **)error)
{
    [GeTuiSdk sendMessage:body error:error];
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
RCT_EXPORT_METHOD(sendFeedbackMessage:(NSInteger)actionId andTaskId:(NSString *)taskId andMsgId:(NSString *)msgId callback:(RCTResponseSenderBlock)callback)
{
    BOOL isSuccess = [GeTuiSdk sendFeedbackMessage:actionId andTaskId:taskId andMsgId:msgId];
    callback(@[isSuccess?@"true":@"false"]);
}

@end
