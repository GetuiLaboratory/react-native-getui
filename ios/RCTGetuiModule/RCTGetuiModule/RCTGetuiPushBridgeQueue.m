//
//  RCTGetuiPushBridgeQueue.m
//
//  Created by daizq on 18/03/15.
//  Copyright © 2017年 getui. All rights reserved.
//

#import "RCTGetuiPushBridgeQueue.h"

@interface RCTGetuiPushBridgeQueue () {
  NSMutableArray<NSDictionary *>* _bridgeQueue;
}

@end

@implementation RCTGetuiPushBridgeQueue


+ (nonnull instancetype)sharedInstance {
  static RCTGetuiPushBridgeQueue* sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [self new];
  });
  
  return sharedInstance;
}


- (instancetype)init {
    self = [super init];
    if (self) {
        self.jsDidLoad = NO;
        _bridgeQueue = [NSMutableArray new];
    }

    return self;
}


- (void)postNotification:(NSNotification *)notification status:(NSString *)status {
    if (!_bridgeQueue) return;
    id obj = [[notification object] mutableCopy];
    [obj setValue:status forKey:@"status"];
    [_bridgeQueue insertObject:obj atIndex:0];
}


- (void)scheduleBridgeQueue {
    for (NSDictionary *notification in _bridgeQueue) {
        NSLog(@"%@", notification);
        NSString* status = [notification objectForKey:@"status"];
        if ([status isEqual: @"receive"]) {
            [[NSNotificationCenter defaultCenter] postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:notification];
        } else if ([status isEqual: @"open"]) {
            [[NSNotificationCenter defaultCenter] postNotificationName:GT_DID_CLICK_NOTIFICATION object:notification];
        }
    }
    [_bridgeQueue removeAllObjects];
}

@end
