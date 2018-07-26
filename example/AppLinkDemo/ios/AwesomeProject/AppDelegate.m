/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 接入个推
  [GeTuiSdk startSdkWithAppId:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret delegate:self];
  // APNs
  [self registerRemoteNotification];
  
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"AwesomeProject"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)registerRemoteNotification {
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0 // Xcode 8编译会调用
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;[center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionCarPlay) completionHandler:^(BOOL granted, NSError *_Nullable error) {
      if (!error) {
        NSLog(@"request authorization succeeded!");
      }
    }];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
#else // Xcode 7编译会调用
    UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
#endif
  } else if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  } else {
    UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert |
                                                                   UIRemoteNotificationTypeSound |
                                                                   UIRemoteNotificationTypeBadge);
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
  }
}
/** 远程通知注册成功委托 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
  token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSLog(@">>>[DeviceToken Success]:%@", token);
  // [ GTSdk ]：向个推服务器注册deviceToken
  [GeTuiSdk registerDeviceToken:token];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  // [ GTSdk ]：将收到的APNs信息传给个推统计
  [GeTuiSdk handleRemoteNotification:userInfo];
  // 控制台打印接收APNs信息
  NSLog(@">>>[Receive RemoteNotification]:%@", userInfo);
  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@"type":@"apns",@"userInfo":userInfo}];
  completionHandler(UIBackgroundFetchResultNewData);
}
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@"type":@"apns",@"userInfo":notification.request.content.userInfo}]; completionHandler(UNNotificationPresentationOptionAlert);
}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  [GeTuiSdk handleRemoteNotification:response.notification.request.content.userInfo];
  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_CLICK_NOTIFICATION object:response.notification.request.content.userInfo];
  completionHandler();
}
#endif
/** SDK收到透传消息回调 */
- (void)GeTuiSdkDidReceivePayloadData:(NSData *)payloadData andTaskId:(NSString *)taskId andMsgId:(NSString *)msgId andOffLine:(BOOL)offLine fromGtAppId:(NSString *)appId {
  // [ GTSdk ]：汇报个推自定义事件(反馈透传消息)
  [GeTuiSdk sendFeedbackMessage:90001 andTaskId:taskId andMsgId:msgId];
  
  // 数据转换
  NSString *payloadMsg = nil;
  if (payloadData) {
    payloadMsg = [[NSString alloc] initWithBytes:payloadData.bytes length:payloadData.length encoding:NSUTF8StringEncoding];
  }
  
  // 控制台打印日志
  NSString *msg = [NSString stringWithFormat:@"taskId=%@,messageId:%@,payloadMsg:%@%@", taskId, msgId, payloadMsg, offLine ? @"<离线消息>" : @""];
  NSDictionary *userInfo = @{@"taskId":taskId,@"msgId":msgId,@"payloadMsg":payloadMsg,@"offLine":offLine?@"YES":@"NO"};
  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@"type":@"payload",@"userInfo":userInfo}];
  NSLog(@">>[GTSdk ReceivePayload]:%@", msg);
}
/** SDK成功注册 CID 回调 */
-(void)GeTuiSdkDidRegisterClient:(NSString *)clientId{
  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_REGISTE_CLIENTID object:clientId];
}

#pragma mark - APPLink 接入

-(BOOL) application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
  
  if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    NSURL* webUrl = userActivity.webpageURL;
    
    //处理个推APPLink回执统计
    //APPLink url 示例：https://link.gl.ink/getui?n=payload&p=mid， 其中 n=payload 字段存储用户透传信息，可以根据透传内容进行业务操作。
    NSString* payload = [GeTuiSdk handleApplinkFeedback:webUrl];
    if (payload) {
      NSLog(@"个推APPLink中携带的用户payload信息: %@,URL : %@", payload, webUrl);
      //TODO:用户可根据具体 payload 进行业务处理
      [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@"type":@"AppLink",@"userInfo":payload}];
    }
  }
  return true;
}

@end
