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

#import <PushKit/PushKit.h>

@interface RCTGetuiModuleEvent : NSObject
@property (nonatomic, copy) NSString *name;
@property (nonatomic) id body;
@end
@implementation RCTGetuiModuleEvent
@end

@interface RCTGetuiModule ()<PKPushRegistryDelegate>

@property (nonatomic, strong) NSMutableArray<RCTGetuiModuleEvent *> *cachedEvents;

@property (nonatomic, assign) BOOL isJsLoad;

@end

@implementation RCTGetuiModule

RCT_EXPORT_MODULE();

+ (instancetype)sharedGetuiModule {
    static RCTGetuiModule *module;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        module = [[super allocWithZone:NULL] init];
        [module setup];
    });
    return module;
}

+ (id)allocWithZone:(NSZone *)zone {
    return [self sharedGetuiModule];
}

- (void)setup
{
    self.cachedEvents = [NSMutableArray array];
    
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    
    [defaultCenter removeObserver:self];
    
    [defaultCenter addObserver:self
                      selector:@selector(jsDidLoadNoti)
                          name:RCTJavaScriptDidLoadNotification
                        object:nil];
}

- (void)jsDidLoadNoti {
    self.isJsLoad = YES;
    dispatch_async(self.methodQueue, ^{
        [self performCachedEvents];
    });
}

- (void)performCachedEvents {
    for (RCTGetuiModuleEvent *event in self.cachedEvents) {
        [self getui_sendAppEventWithName:event.name body:event.body];
    }
    [self.cachedEvents removeAllObjects];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)getui_sendAppEventWithName:(NSString *)name body:(id)body {
#if DEBUG
    NSLog(@"name:%@ body:%@", name, body);
#endif
    if(self.isJsLoad) {
        [self.bridge.eventDispatcher sendAppEventWithName:name
                                                     body:body];
    }else {
        RCTGetuiModuleEvent *event = [[RCTGetuiModuleEvent alloc] init];
        event.name = name;
        event.body = body;
        [self.cachedEvents addObject:event];
    }
}

#pragma mark - GeTuiSdkDelegate

/// [ GTSDK回调 ] SDK启动成功返回cid
- (void)GeTuiSdkDidRegisterClient:(NSString *)clientId {
    [self getui_sendAppEventWithName:@"GeTuiSdkDidRegisterClient"
                                body:clientId];
}

/// [ GTSDK回调 ] SDK运行状态通知
- (void)GeTuiSDkDidNotifySdkState:(SdkStatus)aStatus {
    [self getui_sendAppEventWithName:@"GeTuiSDkDidNotifySdkState"
                                body:@(aStatus)];
}

- (void)GeTuiSdkDidOccurError:(NSError *)error {
    [self getui_sendAppEventWithName:@"GeTuiSdkDidOccurError"
                                body:error.description];
}

//MARK: - 通知回调

/// 通知授权结果（iOS10及以上版本）
/// @param granted 用户是否允许通知
/// @param error 错误信息
- (void)GetuiSdkGrantAuthorization:(BOOL)granted error:(NSError *)error {
    [self getui_sendAppEventWithName:@"GetuiSdkGrantAuthorization"
                                body:@(granted)];
}

/// 通知展示（iOS10及以上版本）
/// @param center center
/// @param notification notification
/// @param completionHandler completionHandler
- (void)GeTuiSdkNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification completionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    [self getui_sendAppEventWithName:@"GeTuiSdkwillPresentNotification" body:notification.request.content.userInfo];
    // [ 参考代码，开发者注意根据实际需求自行修改 ] 根据APP需要，判断是否要提示用户Badge、Sound、Alert等
    //completionHandler(UNNotificationPresentationOptionNone); 若不显示通知，则无法点击通知
    if(completionHandler) {
        completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
    }
}
 
/// 收到通知信息
/// @param userInfo apns通知内容
/// @param center UNUserNotificationCenter（iOS10及以上版本）
/// @param response UNNotificationResponse（iOS10及以上版本）
/// @param completionHandler 用来在后台状态下进行操作（iOS10以下版本）
- (void)GeTuiSdkDidReceiveNotification:(NSDictionary *)userInfo notificationCenter:(UNUserNotificationCenter *)center response:(UNNotificationResponse *)response fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    [self getui_sendAppEventWithName:@"GeTuiSdkDidReceiveNotification" body:userInfo];
    if(completionHandler) {
        // [ 参考代码，开发者注意根据实际需求自行修改 ] 根据APP需要自行修改参数值
        completionHandler(UIBackgroundFetchResultNoData);
    }
}


/// 收到透传消息
/// @param userInfo    推送消息内容
/// @param fromGetui   YES: 个推通道  NO：苹果apns通道
/// @param offLine     是否是离线消息，YES.是离线消息
/// @param appId       应用的appId
/// @param taskId      推送消息的任务id
/// @param msgId       推送消息的messageid
/// @param completionHandler 用来在后台状态下进行操作（通过苹果apns通道的消息 才有此参数值）
- (void)GeTuiSdkDidReceiveSlience:(NSDictionary *)userInfo fromGetui:(BOOL)fromGetui offLine:(BOOL)offLine appId:(NSString *)appId taskId:(NSString *)taskId msgId:(NSString *)msgId fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    // [ GTSDK ]：汇报个推自定义事件(反馈透传消息)，开发者可以根据项目需要决定是否使用, 非必须
    // [GeTuiSdk sendFeedbackMessage:90001 andTaskId:taskId andMsgId:msgId];
    /* demo逻辑 供开发者自行决定
    NSString *msg = [NSString stringWithFormat:@"[ TestDemo ] [APN] %@ \nReceive Slience: fromGetui:%@ appId:%@ offLine:%@ taskId:%@ msgId:%@ userInfo:%@ ", NSStringFromSelector(_cmd), fromGetui ? @"个推消息" : @"APNs消息", appId, offLine ? @"离线" : @"在线", taskId, msgId, userInfo];
    本地通知UserInfo参数
    NSDictionary *dic = nil;
    if (fromGetui) {
        //个推在线透传
        dic = @{@"_gmid_": [NSString stringWithFormat:@"%@:%@", taskId ?: @"", msgId ?: @""]};
    } else {
        //APNs静默通知
        dic = userInfo;
    }
    if (fromGetui && offLine == NO) {
        //个推通道+在线，建议发起本地通知 开发者自行确定
    }
     */
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic addEntriesFromDictionary:userInfo];
    dic[@"fromGetui"] = @(fromGetui);
    dic[@"offLine"] = @(offLine);
    dic[@"appId"] = appId;
    dic[@"taskId"] = taskId;
    dic[@"msgId"] = msgId;
    [self getui_sendAppEventWithName:@"GeTuiSdkDidReceiveSlience" body:dic];
    if(completionHandler) {
        // [ 参考代码，开发者注意根据实际需求自行修改 ] 根据APP需要自行修改参数值
        completionHandler(UIBackgroundFetchResultNoData);
    }
}

- (void)GeTuiSdkNotificationCenter:(UNUserNotificationCenter *)center openSettingsForNotification:(UNNotification *)notification {
    // [ 参考代码，开发者注意根据实际需求自行修改 ] 根据APP需要自行修改参数值
    [self getui_sendAppEventWithName:@"GeTuiSdkOpenSettingsForNotificatio" body:notification.request.content.userInfo];
}

//MARK: - 发送上行消息

/// [ GTSDK回调 ] SDK收到sendMessage消息回调
- (void)GeTuiSdkDidSendMessage:(NSString *)messageId result:(BOOL)isSuccess error:(NSError *)aError {
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    dic[@"messageId"] = messageId;
    dic[@"isSuccess"] = @(isSuccess);
    [self getui_sendAppEventWithName:@"GeTuiSdkDidSendMessage" body:dic];
}


//MARK: - 开关设置

/// [ GTSDK回调 ] SDK设置推送模式回调
- (void)GeTuiSdkDidSetPushMode:(BOOL)isModeOff error:(NSError *)error {
    [self getui_sendAppEventWithName:@"GeTuiSdkDidSetPushMode" body:@(isModeOff)];
}


//MARK: - 别名设置

- (void)GeTuiSdkDidAliasAction:(NSString *)action result:(BOOL)isSuccess sequenceNum:(NSString *)aSn error:(NSError *)aError {
    /*
     参数说明
     isSuccess: YES: 操作成功 NO: 操作失败
     aError.code:
     30001：绑定别名失败，频率过快，两次调用的间隔需大于 5s
     30002：绑定别名失败，参数错误
     30003：绑定别名请求被过滤
     30004：绑定别名失败，未知异常
     30005：绑定别名时，cid 未获取到
     30006：绑定别名时，发生网络错误
     30007：别名无效
     30008：sn 无效 */
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    dic[@"action"] = action;
    dic[@"isSuccess"] = @(isSuccess);
    dic[@"aSn"] = aSn;
    [self getui_sendAppEventWithName:@"GeTuiSdkDidAlias" body:dic];
}


//MARK: - 标签设置

- (void)GeTuiSdkDidSetTagsAction:(NSString *)sequenceNum result:(BOOL)isSuccess error:(NSError *)aError {
    /*
     参数说明
     sequenceNum: 请求的序列码
     isSuccess: 操作成功 YES, 操作失败 NO
     aError.code:
     20001：tag 数量过大（单次设置的 tag 数量不超过 100)
     20002：调用次数超限（默认一天只能成功设置一次）
     20003：标签重复
     20004：服务初始化失败
     20005：setTag 异常
     20006：tag 为空
     20007：sn 为空
     20008：离线，还未登陆成功
     20009：该 appid 已经在黑名单列表（请联系技术支持处理）
     20010：已存 tag 数目超限
     20011：tag 内容格式不正确
     */
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    dic[@"sequenceNum"] = sequenceNum;
    dic[@"isSuccess"] = @(isSuccess);
    [self getui_sendAppEventWithName:@"GeTuiSdkDidSetTags" body:dic];
}

/**
 * 查询当前绑定tag结果返回
 * @param aTags   当前绑定的 tag 信息
 * @param aSn     返回 queryTag 接口中携带的请求序列码，标识请求对应的结果返回
 * @param aError  成功返回nil,错误返回相应error信息
 */
- (void)GetuiSdkDidQueryTag:(NSArray *)aTags sequenceNum:(NSString *)aSn error:(nullable NSError *)aError {
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    dic[@"tags"] = aTags;
    dic[@"sn"] = aSn;
    dic[@"error"] = aError.userInfo;
    [self getui_sendAppEventWithName:@"GetuiSdkDidQueryTag" body:dic];
}

#pragma mark -- JSTONATIVE

#pragma -- JSTONATIVE
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
 *  获取SDK版本号
 *
 *  @return 版本值
 */
RCT_EXPORT_METHOD(version:(RCTResponseSenderBlock)callback)
{
    callback(@[[GeTuiSdk version]]);
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
    callback(@[[NSString stringWithFormat:@"%lu",(unsigned long)[GeTuiSdk status]]]);
}

#pragma mark -

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
 *  向个推服务器注册DeviceToken
 *  备注：可以未启动SDK就调用该方法
 *  注：Xcode11、iOS13 DeviceToken适配，至少使用“SDK-2.4.1.0”版本
 *
 *  @param deviceToken 推送时使用的deviceToken NSData
 *  @return deviceToken有效判断，YES.有效 NO.无效
 *
 */
RCT_EXPORT_METHOD(registerDeviceTokenData:(NSData *)deviceToken)
{
    [GeTuiSdk registerDeviceTokenData:deviceToken];
}

/**
 *  向个推服务器注册VoipToken
 *  备注：可以未启动SDK就调用该方法
 *
 *  @param voipToken 推送时使用的voipToken NSString
 *  @return voipToken有效判断，YES.有效 NO.无效
 *
 */
RCT_EXPORT_METHOD(registerVoipToken:(NSString *)voipToken)
{
    [GeTuiSdk registerVoipToken:voipToken];
}

/**
 *  向个推服务器注册VoipToken
 *  备注：可以未启动SDK就调用该方法
 *  注：Xcode11、iOS13 DeviceToken适配，至少使用“SDK-2.4.1.0”版本
 *
 *  @param voipToken 推送时使用的voipToken NSData
 *  @return voipToken有效判断，YES.有效 NO.无效
 *
 */
RCT_EXPORT_METHOD(registerVoipTokenCredentials:(NSData *)voipToken)
{
    [GeTuiSdk registerVoipTokenCredentials:voipToken];
}

#pragma mark -

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
 *  给用户打标签, 后台可以根据标签进行推送
 *
 *  @param tags 别名数组
 *  tag: 只能包含中文字符、英文字母、0-9、+-*_.的组合（不支持空格）
 *  @param aSn  绑定序列码, 不为nil
 *  @return 提交结果，YES表示尝试提交成功，NO表示尝试提交失败
 */
RCT_EXPORT_METHOD(setTags:(NSArray *)tags andSequenceNum:(NSString *)aSn)
{
    [GeTuiSdk setTags:tags andSequenceNum:aSn];
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

/**
 *  复位角标，等同于"setBadge:0"
 *
 *  SDK-1.4.0+
 *
 */
RCT_EXPORT_METHOD(resetBadge)
{
    [GeTuiSdk resetBadge];
}

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
*   开启推送.
*/
RCT_EXPORT_METHOD(turnOnPush)
{
    [GeTuiSdk setPushModeForOff:NO];
}

/**
*   关闭推送.
*/
RCT_EXPORT_METHOD(turnOffPush)
{
    [GeTuiSdk setPushModeForOff:YES];
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
 *  SDK发送上行消息结果
 *
 *  @param body  需要发送的消息数据
 *
 *  @return 消息的msgId
 */
RCT_EXPORT_METHOD(sendMessage:(NSData *)body)
{
    [GeTuiSdk sendMessage:body];
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

/**
 *  清空下拉通知栏全部通知,并将角标置“0”，不显示角标
 */
RCT_EXPORT_METHOD(clearAllNotificationForNotificationBar)
{
    [GeTuiSdk clearAllNotificationForNotificationBar];
}

#pragma mark - VOIP related

// 实现 PKPushRegistryDelegate 协议方法

/** 系统返回VOIPToken，并提交个推服务器 */

- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type {
    // [ GTSDK ]：（新版）向个推服务器注册 VoipToken
    [GeTuiSdk registerVoipTokenCredentials:credentials.token];
            
    // [ 测试代码 ] 日志打印DeviceToken
    NSLog(@"[ TestDemo ] [ VoipToken(NSData) ]: %@\n\n", credentials.token);
}

/** 接收VOIP推送中的payload进行业务逻辑处理（一般在这里调起本地通知实现连续响铃、接收视频呼叫请求等操作），并执行个推VOIP回执统计 */
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type {
    //个推VOIP回执统计
    [GeTuiSdk handleVoipNotification:payload.dictionaryPayload];
    
    //TODO:接受 VoIP 推送中的 payload 内容进行具体业务逻辑处理
    NSLog(@"[VoIP Payload]:%@,%@", payload, payload.dictionaryPayload);
    
    NSDictionary *ret = [NSDictionary dictionaryWithObjectsAndKeys:
                         [NSNumber numberWithInteger:1], @"result",
                         @"voipPayload", @"type",
                         payload.dictionaryPayload[@"payload"], @"payload",
                         payload.dictionaryPayload[@"_gmid_"], @"gmid",  nil];
    [self getui_sendAppEventWithName:@"voipPushPayload" body:ret];
}

RCT_EXPORT_METHOD(voipRegistration)
{
    dispatch_queue_t mainQueue = dispatch_get_main_queue();
    PKPushRegistry *voipRegistry = [[PKPushRegistry alloc] initWithQueue:mainQueue];
    voipRegistry.delegate = self;
    // Set the push type to VoIP
    voipRegistry.desiredPushTypes = [NSSet setWithObject:PKPushTypeVoIP];
}

@end

