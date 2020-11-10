# react-native-getui 
react-native-getui 是个推官方开发的 React Native 插件，使用该插件可以方便快速地集成推送功能。

多厂商版本请联系技术支持


# 环境

- React Native Version ： 0.42(demo中使用的rn版本)，理论上可以任意使用其他任何RN版本
- 当前react-native-getui版本 1.1.35 , GetuiSdk 版本 4.3.5.9
- taobao的源和npm源版本可能存在不一致

# 安装

### 使用 npm 自动安装

在您的项目根目录下执行

````
npm install react-native-getui -save
````
````
react-native link
````
````
npm run GetuiConfigure <yourAppId> <yourAppKey> <yourAppSecret>  <yourModuleName>
// yourModuleName 指的是你的 Android 项目中的模块名称（对 iOS 没有影响，不填写的话默认值为 app）
// 举个列子：
npm run GetuiConfigure DI1jwW3FtZ6kGDeY5dk0Y9 DQCk2V8Jev9hqhWDU94PF9 Rtyp5trKUt8HSyzD8zRXX7 app

````

```
// 链接iOS原生代码
npx pod-install
```

(如果是原生应用集成react-native)使用CocoaPods安装

如果你的 React Native 是通过 Cocoapods 来集成的则使用下面两个步骤来集成，注意： 使用 pod 就不要使用 react-native link 了，不然会有冲突。

1.在Podfile中添加如下代码：

````
pod 'GtSdkRN', :path => '../node_modules/react-native-getui'
````

2.终端执行如下命令：

````
pod install
````

#### 注意:

- 如果在执行GetuiConfigure 自动安装脚本时发生错误，请使用手动安装方式。

- yourAppId/yourAppKey/yourAppSecret 需要去 [个推官网](https://dev.getui.com) 注册后，在后台配置获取。

- 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：
````
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
````
- 您的工程目录/android/app/src/main/{您的包名}/MainActivity的onCreate中调用
````
GetuiModule.initPush(this);
````
- 本插件采用maven方式引入sdk，故需要在android/build.gradle中添加maven地址
````
 maven {
            url "http://mvn.gt.igexin.com/nexus/content/repositories/releases/"
        }
````

#### 注意：

- 有可能您的MainActivity中未重写onCreate方法，如果未重写，请重写onCreate方法，方法如下：
````
protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GetuiModule.initPush(this);
    }
````
如果您使用Android Studio作为IDE，Android Studio会自动为您import 相应的类名，如果您使用其他的IDE，请import相关的类

````
import android.os.Bundle;
import com.getui.reactnativegetui.GetuiModule;
````

####  react-native 0.60.0以上版本在Android上的初始化流程有所变化
如果你使用0.60.0以上的RN版本，请在MainApplication.java的文件里注册以下信息
````java
private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
           // 注册个推插件包
           packages.add(new GetuiPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
      .......
       @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // 初始化个推模块
    GetuiModule.initPush(this);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }


````

### 手动安装

1、
````
npm install react-native-getui -save
````

2、
````
react-native link
````

3、
[Xcode 工程配置](https://github.com/GetuiLaboratory/react-native-getui/blob/master/example/document/iOS.md)

4、
[Android Studio 工程配置](https://github.com/GetuiLaboratory/react-native-getui/blob/master/example/document/android.md)

5、在 iOS 工程中如果找不到头文件需要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：

````
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
````

6、因新版本功能修改，需要添加“libresolv.tbd”库

### 订阅消息

1.payload透传消息回调

2.cid 拿到clientId的回调

3.notificationArrived通知消息到达的回调

4.notificationClicked通知消息点击的回调

````javascript
var { NativeAppEventEmitter } = require('react-native');

var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
    'receiveRemoteNotification',
    (notification) => {
        switch (notification.type) {
            case "cid":
                Alert.alert('初始化获取到cid',JSON.stringify(notification))
                break;
            case 'payload':
                Alert.alert('payload 消息通知',JSON.stringify(notification))
                break
            case 'cmd':
                Alert.alert('cmd 消息通知', 'cmd action = ' + notification.cmd)
                break
            case 'notificationArrived':
                Alert.alert('notificationArrived 通知到达',JSON.stringify(notification))
                break
            case 'notificationClicked':
                Alert.alert('notificationArrived 通知点击',JSON.stringify(notification))
                break
            default:
                break
        }
    }
);

var clickRemoteNotificationSub = NativeAppEventEmitter.addListener(
    'clickRemoteNotification',
    (notification) => {
        Alert.alert('点击通知',JSON.stringify(notification))
    }
);
````

# 示例

* 我们提供了一个demo供开发者参考对照 [demo](https://github.com/GetuiLaboratory/react-native-getui/tree/master/example/pushDemo)


* 新版本插件[new demo](https://github.com/GetuiLaboratory/react-native-getui/tree/master/example/pushDemo_new)

