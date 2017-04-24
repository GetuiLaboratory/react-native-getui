//
//  RCTGetuiModule.h
//  RCTGetuiModule
//
//  Created by admin on 17/2/27.
//  Copyright © 2017年 getui. All rights reserved.
//

#import <Foundation/Foundation.h>


#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#elif __has_include("React/RCTBridgeModule.h")
#import "React/RCTBridgeModule.h"
#endif

#import "GeTuiSdk.h"

#define GT_DID_RECEIVE_REMOTE_NOTIFICATION @"GtDidReciveRemoteNotification"
#define GT_DID_CLICK_NOTIFICATION @"GtDidClickNotification"
#define GT_DID_REGISTE_CLIENTID @"GtDidRegisteClient"

@interface RCTGetuiModule : NSObject <RCTBridgeModule>

@end
