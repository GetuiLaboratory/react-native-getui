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
        var oldValue = rf.match(/GeTuiSdk registerRemoteNotification/)
        if(oldValue == null) {
            rf = rf.replace(searchDidlaunch[0],searchDidlaunch[0] + "\n  \/\/ 接入个推\n	\[GeTuiSdk startSdkWithAppId:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret delegate:\[RCTGetuiModule sharedGetuiModule\] launchingOptions:launchOptions\]\;\n  \/\/ APNs\n  \[GeTuiSdk registerRemoteNotification: \(UNAuthorizationOptionSound \| UNAuthorizationOptionAlert \| UNAuthorizationOptionBadge\)\]\;");
            fs.writeFileSync(path, rf, "utf-8");
        }
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
	rf = rf.replace("\#import \<UIKit\/UIKit.h\>","\#import \<UIKit\/UIKit.h\>\n\#if __has_include\(\<RCTGetuiModule\/RCTGetuiModule.h\>\)\n\#import \<RCTGetuiModule\/RCTGetuiModule.h\>\n\#elif __has_include\(\"RCTGetuiModule.h\"\)\n\#import \"RCTGetuiModule.h\"\n\#elif __has_include\(\<GtSdkRN\/RCTGetuiModule.h\>\)\n\#import \<GtSdkRN\/RCTGetuiModule.h\>\n\#endif\n#define kGtAppId \@\""+appId+"\"\n\#define kGtAppKey \@\""+appKey+"\"\n\#define kGtAppSecret \@\""+appSecret+"\"\n");
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
