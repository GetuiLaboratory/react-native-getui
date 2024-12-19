#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#if __has_include(<RCTGetuiModule/RCTGetuiModule.h>)
#import <RCTGetuiModule/RCTGetuiModule.h>
#elif __has_include("RCTGetuiModule.h")
#import "RCTGetuiModule.h"
#elif __has_include(<GtSdkRN/RCTGetuiModule.h>)
#import <GtSdkRN/RCTGetuiModule.h>
#endif
#define kGtAppId @"DI1jwW3FtZ6kGDeY5dk0Y9"
#define kGtAppKey @"DQCk2V8Jev9hqhWDU94PF9"
#define kGtAppSecret @"Rtyp5trKUt8HSyzD8zRXX7"


@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
