#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#if __has_include(<RCTGetuiModule/RCTGetuiModule.h>)
#import <RCTGetuiModule/RCTGetuiModule.h>
#elif __has_include("RCTGetuiModule.h")
#import "RCTGetuiModule.h"
#elif __has_include(<GtSdkRN/RCTGetuiModule.h>)
#import <GtSdkRN/RCTGetuiModule.h>
#endif
#define kGtAppId @"xXmjbbab3b5F1m7wAYZoG2"
#define kGtAppKey @"BZF4dANEYr8dwLhj6lRfx2"
#define kGtAppSecret @"yXRS5zRxDt8WhMW8DD8W05"

@interface AppDelegate : RCTAppDelegate

@end
