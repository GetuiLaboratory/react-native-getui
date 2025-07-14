//
//  RCTGetuiPushBridgeQueue
//
//  Created by daizq on 18/03/15.
//  Copyright © 2017年 getui. All rights reserved.
//



#import <Foundation/Foundation.h>
#import "RCTGetuiModule.h"

@interface RCTGetuiPushBridgeQueue : NSObject

@property BOOL jsDidLoad;
@property NSDictionary* openedRemoteNotification;
@property NSDictionary* openedLocalNotification;

+ (nonnull instancetype)sharedInstance;

- (void)postNotification:(NSNotification *)notification status:(NSString *)status;
- (void)scheduleBridgeQueue;

@end
