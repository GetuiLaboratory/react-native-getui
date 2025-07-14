//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//


#if __has_include(<RCTGetuiModule/RCTGetuiModule.h>)
#import <RCTGetuiModule/RCTGetuiModule.h>
#elif __has_include("RCTGetuiModule.h")
#import "RCTGetuiModule.h"
#elif __has_include(<GtSdkRN/RCTGetuiModule.h>)
#import <GtSdkRN/RCTGetuiModule.h>
#endif

#import "RCTGetuiModule.h"  // 导入个推插件头文件


//#import <ReactCommon/RCTTurboModuleManager.h>
#import <React/CoreModulesPlugins.h>
