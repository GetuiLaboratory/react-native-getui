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

#import <GTSDK/GeTuiSdk.h>

@interface RCTGetuiModule : NSObject<RCTBridgeModule>

@end

@interface RCTGetuiModule3 : NSObject <RCTBridgeModule, GeTuiSdkDelegate>
@property (nonatomic, assign) BOOL isJsLoad;
+ (instancetype)sharedGetuiModule;
- (void)setupBridge:(RCTBridge*)b;
@end
