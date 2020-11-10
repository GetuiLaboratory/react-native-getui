//   这个地方是更新配置文件 的脚本
var fs = require('fs');
var spath = require('path');
var os = require('os');

// add other link flag

var moduleName = process.argv[5];
if (moduleName == undefined || moduleName == null) {
	console.log("没有输入 moduleName, 将使用默认模块名： app");
	moduleName = "app";
};

var appId = process.argv[2];
if (appId == undefined || appId == null) {
	console.log("error 没有输入 appId 参数");
	return;
}

var appKey = process.argv[3];
if (appKey == undefined || appKey == null) {
	console.log("error 没有输入 appKey 参数");
	return;
}

var appSecret = process.argv[4];
if (appSecret == undefined || appSecret == null) {
	console.log("error 没有输入 appSecret 参数");
	return;
}


function insertIOSImplCode(path){
	// 	 这个是插入代码的脚本 install


	if (isFile(path) == false) {
		console.log("configuration Getui error!!");
		return;
	}

	var rf = fs.readFileSync(path,"utf-8");
	// 不做删除工作，默认认为没有 Getui 相关代码
	// 插入 注册推送 和启动 Getui SDK
// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
	var rf = fs.readFileSync(path,"utf-8");
	var searchDidlaunch = rf.match(/\n.*didFinishLaunchingWithOptions.*\n?\{/);
	if (searchDidlaunch == null) {
		console.log("没有匹配到 didFinishLaunchingWithOptions");
		console.log(rf);
	} else {
		// console.log(searchDidlaunch[0]);
        var oldValue = rf.match(/\[self registerRemoteNotification\]/)
        if(oldValue == null) {
                    rf = rf.replace(searchDidlaunch[0],searchDidlaunch[0] + "\n  \/\/ 接入个推\n\	[GeTuiSdk startSdkWithAppId:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret delegate:self\]\;\n \/\/ APNs\n  \[self registerRemoteNotification\]\;");
                    fs.writeFileSync(path, rf, "utf-8");
        }

	}

	// 这里插入 registerRemoteNotification
	var rf = fs.readFileSync(path,"utf-8");
	var search = rf.match(/\n.*registerRemoteNotification.*\n?\{\n/);
	if (search == null) {
			console.log("没有匹配到 函数 registerRemoteNotification");
			rf = rf.replace(/\@end/,"- (void)registerRemoteNotification {\n	if \(\[\[UIDevice currentDevice\].systemVersion floatValue\] >= 10.0\) \{\n\#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0 \/\/ Xcode 8编译会调用\nUNUserNotificationCenter \*center = \[UNUserNotificationCenter currentNotificationCenter\]\;\ncenter.delegate = self\;\[center requestAuthorizationWithOptions:\(UNAuthorizationOptionBadge \| UNAuthorizationOptionSound \| UNAuthorizationOptionAlert \| UNAuthorizationOptionCarPlay\) completionHandler:\^\(BOOL granted, NSError \*_Nullable error\) \{\nif \(!error\) \{\nNSLog\(\@\"request authorization succeeded!\"\)\;\n\}\n\}\]\;\n\[\[UIApplication sharedApplication\] registerForRemoteNotifications\]\;\n\#else \/\/ Xcode 7编译会调用\nUIUserNotificationType types = \(UIUserNotificationTypeAlert \| UIUserNotificationTypeSound \| UIUserNotificationTypeBadge\)\;\nUIUserNotificationSettings \*settings = \[UIUserNotificationSettings settingsForTypes:types categories:nil\]\;\n[[UIApplication sharedApplication] registerUserNotificationSettings:settings];\n[[UIApplication sharedApplication] registerForRemoteNotifications];\n\#endif\n} else if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {\nUIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge);\nUIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];\n[[UIApplication sharedApplication] registerUserNotificationSettings:settings];\n[[UIApplication sharedApplication] registerForRemoteNotifications];\n} else {\nUIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert |\nUIRemoteNotificationTypeSound |\nUIRemoteNotificationTypeBadge);\n[[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];\n}\n}\n\@end");
			// console.log(rf);
			fs.writeFileSync(path, rf, "utf-8");
	}


	//  这个插入代码 didRegisterForRemoteNotificationsWithDeviceToken
	var rf = fs.readFileSync(path,"utf-8");
	var search = rf.match(/\n.*didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken[ ]*\{/);
	var tokenMatchStr = "\n	NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@\"<>\"]];\n  token = [token stringByReplacingOccurrencesOfString:@\" \" withString:@\"\"];\n  NSLog(\@\"\>\>\>[DeviceToken Success]:\%\@\", token);\n\/\/ [ GTSdk ]：向个推服务器注册deviceToken\n  [GeTuiSdk registerDeviceTokenData:deviceToken];\n"
	if (search == null) {
		console.log("没有匹配到 函数 didRegisterForRemoteNotificationsWithDeviceToken");
		rf = rf.replace(/\@end/,"/** 远程通知注册成功委托 */\n \- \(void\)application\:\(UIApplication \*\)application\ didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken \{"+ tokenMatchStr +"\}\n\@end");
		// console.log(rf);
		fs.writeFileSync(path, rf, "utf-8");
	} else {
      var oldValue = rf.match(/\[GeTuiSdk registerDeviceTokenData:deviceToken/)
      if(oldValue == null) {
          rf = rf.replace(search[0], search[0] + tokenMatchStr);
          fs.writeFileSync(path, rf, "utf-8");
      }
	}
	//
  //   // 这里插入 didReceiveRemoteNotification
  //   var rf = fs.readFileSync(path,"utf-8");
  //   var search = rf.match(/\n.*didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo[ ]*\{/);
  //   if (search == null) {
  //       console.log("没有匹配到 函数 didReceiveRemoteNotification");
  //       rf = rf.replace(/\@end/,"\- \(void\)application\:\(UIApplication \*\)application\ didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo \{\n\[\[NSNotificationCenter\ defaultCenter\]\ postNotificationName\:kJPFDidReceiveRemoteNotification\ object\:userInfo\]\;\n\}\n\@end");
  //       // console.log(rf);
  //       fs.writeFileSync(path, rf, "utf-8");
  //   }
	//
    // 这里插入 didReceiveRemoteNotification fetchCompletionHandler
    var rf = fs.readFileSync(path,"utf-8");
		var mathStr = "// [ GTSdk ]：将收到的APNs信息传给个推统计\n  [GeTuiSdk handleRemoteNotification:userInfo];\n// 控制台打印接收APNs信息\nNSLog(@\">>>[Receive RemoteNotification]:%@\", userInfo);\n  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@\"type\":@\"apns\",@\"userInfo\":userInfo}];\n  completionHandler(UIBackgroundFetchResultNewData);"
    var search = rf.match(/\n.*didReceiveRemoteNotification\:[ ]*\(NSDictionary \*\)[ ]*userInfo[ ]*fetchCompletionHandler\:\(void[ ]*\(\^\)[ ]*\(UIBackgroundFetchResult\)\)completionHandler \{/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification fetchCompletionHandler");
        rf = rf.replace(/\@end/,"\- \(void\)application\:\(UIApplication \*\)application\ didReceiveRemoteNotification\:\(NSDictionary \*\)userInfo fetchCompletionHandler\:\(void\ \(\^\)   \(UIBackgroundFetchResult\)\)completionHandler\ \{\n"+mathStr+"\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

    // 这里插入 willPresentNotification
    var rf = fs.readFileSync(path,"utf-8");
    var search = rf.match(/\n.*willPresentNotification\:\(UNNotification \*\)notification[ ]*withCompletionHandler\:.*\{\n/);
    if (search == null) {
        console.log("没有匹配到 函数 willPresentNotification");
        rf = rf.replace(/\@end/,"#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0\n\- \(void\)userNotificationCenter\:\(UNUserNotificationCenter\ \*\)center willPresentNotification\:\(UNNotification\ \*\)notification\ withCompletionHandler\:\(void\ \(\^\)\(UNNotificationPresentationOptions\)\)completionHandler\ \{\n [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@\"type\":@\"apns\",@\"userInfo\":notification.request.content.userInfo}]; completionHandler\(UNNotificationPresentationOptionAlert\)\;\n\}\n\@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }
	//
    // 这里插入 didReceiveNotificationResponse
    var rf = fs.readFileSync(path,"utf-8");
    var search = rf.match(/\n.*userNotificationCenter\:\(UNUserNotificationCenter \*\)center[ ]*didReceiveNotificationResponse\:\(UNNotificationResponse\ \*\)response.*\{\n/);
    if (search == null) {
        console.log("没有匹配到 函数 didReceiveRemoteNotification");
        rf = rf.replace(/\@end/,"\- \(void\)userNotificationCenter\:\(UNUserNotificationCenter\ \*\)center\ didReceiveNotificationResponse\:\(UNNotificationResponse\ \*\)response\ withCompletionHandler\:\(void\ \(\^\)\(\)\)completionHandler\ \{\n [GeTuiSdk handleRemoteNotification:response.notification.request.content.userInfo];\n  [[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_CLICK_NOTIFICATION object:response.notification.request.content.userInfo];\ncompletionHandler\(\)\;\n\}\n#endif\n@end");
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

		// 这里插入 SDK 注册 cid 成功回调
		var rf = fs.readFileSync(path,"utf-8");
    var search = rf.match(/\n.*GeTuiSdkDidRegisterClient\:.*\{\n/);
		var mathStr = "/** SDK成功注册 CID 回调 */\n-(void)GeTuiSdkDidRegisterClient:(NSString *)clientId{\n[[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_REGISTE_CLIENTID object:clientId];\n}\n"
    if (search == null) {
        console.log("没有匹配到 函数 GeTuiSdkDidRegisterClient");

				rf = rf.replace(/\@end/,mathStr+"\n@end")
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }

		// 这里插入 SDK收到透传消息回调
    var rf = fs.readFileSync(path,"utf-8");
    var search = rf.match(/\n.*andTaskId\:\(NSString \*\)taskId[ ]*andMsgId\:.*\{\n/);
		var mathStr = "/** SDK收到透传消息回调 */\n- (void)GeTuiSdkDidReceivePayloadData:(NSData *)payloadData andTaskId:(NSString *)taskId andMsgId:(NSString *)msgId andOffLine:(BOOL)offLine fromGtAppId:(NSString *)appId {\n// [ GTSdk ]：汇报个推自定义事件(反馈透传消息)\n[GeTuiSdk sendFeedbackMessage:90001 andTaskId:taskId andMsgId:msgId];\n\n// 数据转换\nNSString *payloadMsg = nil;\nif (payloadData) {\npayloadMsg = [[NSString alloc] initWithBytes:payloadData.bytes length:payloadData.length encoding:NSUTF8StringEncoding];\n}\n\n// 控制台打印日志\nNSString *msg = [NSString stringWithFormat:@\"taskId=%@,messageId:%@,payloadMsg:%@%@\", taskId, msgId, payloadMsg, offLine ? @\"<离线消息>\" : @\"\"];\nNSDictionary *userInfo = @{@\"taskId\":taskId,@\"msgId\":msgId,@\"payloadMsg\":payloadMsg,@\"offLine\":offLine?@\"YES\":@\"NO\"};\n[[NSNotificationCenter defaultCenter]postNotificationName:GT_DID_RECEIVE_REMOTE_NOTIFICATION object:@{@\"type\":@\"payload\",@\"userInfo\":userInfo}];\nNSLog(@\">>[GTSdk ReceivePayload]:%@\", msg);\n}"
    if (search == null) {
        console.log("没有匹配到 函数 GeTuiSdkDidReceivePayloadData");

				rf = rf.replace(/\@end/,mathStr+"\n@end")
        // console.log(rf);
        fs.writeFileSync(path, rf, "utf-8");
    }
}

// 插入 Appdelegate.h 文件代码
function insertIOSHeaderCode(path) {
	if (isFile(path) == false) {
		console.log("configuration Getui error!!");
		return;
	}

	var rf = fs.readFileSync(path,"utf-8");
	// 不做删除工作，默认认为没有 Getui 相关代码

	// 插入 头文件
	var oldValue = rf.match(/RCTGetuiModule.h/)
	if (oldValue != null) {
		return
	}
	rf = rf.replace("\#import \<UIKit\/UIKit.h\>","\#import \<UIKit\/UIKit.h\>\n\#import \<RCTGetuiModule\/RCTGetuiModule.h\>\n\#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0\n\#import \<UserNotifications\/UserNotifications.h\>\n\#endif\n\#define kGtAppId \@\""+appId+"\"\n\#define kGtAppKey \@\""+appKey+"\"\n\#define kGtAppSecret \@\""+appSecret+"\"\n");
	rf = rf.replace("UIApplicationDelegate","UIApplicationDelegate,UNUserNotificationCenterDelegate,GeTuiSdkDelegate");
	fs.writeFileSync(path, rf, "utf-8");
}


// 判断文件
function exists(path){
     return fs.existsSync(path) || path.existsSync(path);
}

function isFile(path){
    return exists(path) && fs.statSync(path).isFile();
}

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();
}


//  深度遍历所有文件，
getAllfiles("./ios",function (f, s) {
  var isAppdelegateImpl = f.match(/AppDelegate\.m/);
  // 找到Appdelegate.m 文件 插入代码
  if (isAppdelegateImpl != null) {
  	console.log("the file is appdelegate:"+f);
		insertIOSImplCode(f);
  }
	var isAppdelegateHeader = f.match(/AppDelegate\.h/);

	if (isAppdelegateHeader != null) {
		console.log("the file is appdelegate:"+f);
		insertIOSHeaderCode(f);
	}
});


getAndroidManifest("./android/" + moduleName, function(f, s) {
	var isAndroidManifest = f.match(/AndroidManifest\.xml/);
	if (isAndroidManifest != null) {
		console.log("find AndroidManifest in " + moduleName);
		configureAndroidManifest(f);
	};
});

getConfigureFiles("./android", function (f, s) {
	//找到settings.gradle
	var isSettingGradle = f.match(/settings\.gradle/);
	if (isSettingGradle != null) {
		console.log("find settings.gradle in android project " + f);
		configureSetting(f);
	}

	//找到project下的build.gradle
	var isProjectGradle = f.match(/.*\/build\.gradle/);
	if (isProjectGradle != null) {
		console.log("find build.gradle in android project " + f);
		configureGradle(f);
	}
});



function getAllfiles(dir, findOne) {

  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function');
  }

  eachFileSync(spath.resolve(dir), findOne);
}

function eachFileSync (dir, findOne) {
  var stats = fs.statSync(dir);
  findOne(dir, stats);

  // 遍历子目录
  if (stats.isDirectory()) {
    var files = fullPath(dir, fs.readdirSync(dir));
    // console.log(dir);
    files.forEach(function (f) {
      eachFileSync(f, findOne);
    });
  }
}

function fullPath (dir, files) {
  return files.map(function (f) {
    return spath.join(dir, f);
  });
}

// android
function getGradleFile(dir, findOne) {
	if (typeof findOne !== 'function') {
		throw new TypeError('The argument "findOne" must be a function');
	}

	eachFileSync(spath.resolve(dir), findOne);

}

function getAndroidManifest(dir, findOne) {
    if (typeof findOne !== 'function') {
    	throw new TypeError('The argument "findOne" must be a function');
    }

    eachFileSync(spath.resolve(dir), findOne);
}


function getConfigureFiles(dir, findOne) {
	if (typeof findOne !== 'function') {
		throw new TypeError('The argument "findOne" must be a function');
	}

	eachFileSync(spath.resolve(dir), findOne);
}

function configureAndroidManifest(path) {
     if( isFile(path) == false) {
         console.log("configuration Getui error!!");
         return;
     }

     var rf = fs.readFileSync(path, "utf-8");
     var isAlreadyWrite = rf.match(/.*android\:value=\"\$\{PUSH_APPID\}\"/);
     if (isAlreadyWrite == null){
        var searchKey = rf.match(/\n.*\<\/activity\>/);
        	if (searchKey != null) {
        		rf = rf.replace(searchKey[0], searchKey[0] + "\n\n\<meta-data android\:name=\"PUSH_APPID\" android\:value=\"" + appId + "\"\/\>\n\<meta-data android\:name=\"PUSH_APPKEY\" android\:value=\"" + appKey + "\"\/\>\n\<meta-data android\:name=\"PUSH_APPSECRET\" android\:value=\"" + appSecret + "\"\/\>\n");
        		fs.writeFileSync(path, rf, "utf-8");
        	}
     }
}

function configureSetting(path) {
	if (isFile(path) == false) {
		console.log("configuration Getui error!!");
		return;
	}

	var rf = fs.readFileSync(path, "utf-8");
	var isAlreadyWrite = rf.match(/.*react-native-getui.*/);
	if (isAlreadyWrite == null) {
		var searchKey = rf.match(/\n.*include.*/);
		if (searchKey != null) {
			rf = rf.replace(searchKey[0], searchKey[0] + "\, \'\:react-native-getui\'\nproject\(\'\:react-native-getui\'\)\.projectDir = new File\(rootProject\.projectDir\, \'\.\.\/node_modules\/react-native-getui\/android\'\)\n" );
			fs.writeFileSync(path, rf, "utf-8");
		} else {
			console.log("Did not find include in settings.gradle: " + path);
		}
	}

}

function configureGradle(path) {
	if (isFile(path) == false) {
		console.log("configuration Getui error!!");
		return;
	}

	var rf = fs.readFileSync(path, "utf-8");
	var isAlreadyWrite = rf.match(/.*react-native-getui.*/);
	if (isAlreadyWrite == null) {
		var searchKey = rf.match(/\n.*compile fileTree.*\n/);
		if (searchKey != null) {
			rf = rf.replace(searchKey[0], searchKey[0] + "    compile project\(\'\:react-native-getui\'\)\n");
			fs.writeFileSync(path, rf, "utf-8");
		} else {
			console.log("Did not find \"compile\" in path: " + path);
		}
	}
}
