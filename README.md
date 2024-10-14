# react-native-getui 
react-native-getui 是个推官方开发的 React Native 插件，使用该插件可以方便快速地集成推送功能。

多厂商版本请联系技术支持


# 环境

- React Native Version 
"react": "18.3.1",
"react-native": "0.75.4",
(demo中使用的rn版本)，理论上可以任意使用其他任何RN版本

- 当前react-native-getui版本 1.1.47
- taobao的源和npm源版本可能存在不一致

# 安装

### 使用 npm 自动安装

在您的项目根目录下执行

````
step1:添加npm包依赖
npm install react-native-getui -save


step2:iOS, pod项目, 链接iOS原生代码
npx pod-install


step2:iOS, 非pod项目, 链接
react-native link


step3: 自动添加GTSDK配置代码
npm run GetuiConfigure <yourAppId> <yourAppKey> <yourAppSecret>  <yourModuleName>

// yourModuleName 指的是你的 Android 项目中的模块名称（对 iOS 没有影响，不填写的话默认值为 app）
// 举个列子：
npm run GetuiConfigure DI1jwW3FtZ6kGDeY5dk0Y9 DQCk2V8Jev9hqhWDU94PF9 Rtyp5trKUt8HSyzD8zRXX7 app

````


(如果是原生应用集成react-native)使用CocoaPods安装

如果你的 React Native 是通过 Cocoapods 来集成的则使用下面两个步骤来集成，注意： 使用 pod 就不要使用 react-native link 了，不然会有冲突。

1.在Podfile中添加如下代码（需要写在对应的 target 里）：

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
            url "https://mvn.getui.com/nexus/content/repositories/releases/"
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

订阅来自GTSDK的回调，方式有两种，分别如下：

````javascript

//订阅方式一：
import { NativeEventEmitter, NativeModules } from 'react-native';
const { GetuiModule } = NativeModules;
const GetuiEmitter = new NativeEventEmitter(NativeModules.GetuiModule);
const subscription = GetuiEmitter.addListener(
  'GeTuiSdkDidRegisterClient',
  (message) => {
    console.log("receive cid " + message)
  }
);
// 别忘了取消订阅，通常在componentWillUnmount生命周期方法中实现。
// subscription.remove();


// 监听方式二：
var { NativeAppEventEmitter } = require('react-native');
let names: string[] = [
  "GeTuiSdkDidRegisterClient",
  "GeTuiSDkDidNotifySdkState",
  "GeTuiSdkDidOccurError",
  "GetuiSdkGrantAuthorization",
  "GeTuiSdkwillPresentNotification",
  "GeTuiSdkDidReceiveNotification",
  "GeTuiSdkDidReceiveSlience",
  "GeTuiSdkOpenSettingsForNotification",
  "GeTuiSdkDidSendMessage",
  "GeTuiSdkDidSetPushMode",
  "GeTuiSdkDidAlias",
  "GeTuiSdkDidSetTags",
  "GetuiSdkDidQueryTag",
  "voipPushPayload",
  "GeTuiSdkDidRegisterLiveActivity",
  "GeTuiSdkDidRegisterPushToStartToken"];

// 监听个推回调
const listenerCallBack = (eventName: string, message: any) => {
  console.log('Event Received', `Event: ${eventName}\nMessage: ${JSON.stringify(message)}`);
  Alert.alert('Event Received', `Event: ${eventName}\nMessage: ${JSON.stringify(message)}`);
  switch (eventName) {
    case 'GeTuiSdkDidRegisterClient':
      console.log("收到cid回调", message)
      break;
    case 'GeTuiSdkwillPresentNotification':
      console.log("收到通知展示")
      break;
    case 'GeTuiSdkDidReceiveNotification':
      console.log("收到通知点击")
      break;
    case 'GeTuiSdkDidReceiveSlience':
      console.log("收到透传")
      break;
    //...开发者自行处理
  }
};

````



## iOS注意事项

项目需要打开通知能力，才能获取DeviceToken用于通知展示点击等业务。Xcode打开工程,Signing & Capabilities中添加Push Notification和Background Modes如下：

<img src="./pics/xcode1.png" width="800px"/>





上述GetuiConfigure指令会在AppDelegate中插入初始化GTSDK代码，具体如下：

<img src="./pics/xcode2.png" width="800px"/>



<img src="./pics/xcode3.png" width="800px"/>



# 示例

* 新版本插件[new demo](https://github.com/GetuiLaboratory/react-native-getui/tree/master/example/pushDemo_new)

* iOS 最新[参考Demo](https://github.com/GetuiLaboratory/react-native-getui/tree/master/example/pushDemo_2024)
