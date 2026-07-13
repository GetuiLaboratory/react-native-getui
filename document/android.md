# Android 手动集成方式


React Native `0.60+` 默认使用 Autolinking。以下说明适用于 `react-native-getui@1.1.56`；仅旧版非 Autolinking 项目才需要手动添加 `react-native-getui` Gradle 工程依赖。


## 个推 Maven 仓库

从 react-native-getui 1.1.56 开始，Android 个推 SDK 不再随插件提供本地 JAR，改为使用以下 Maven 依赖：

```gradle
implementation 'com.getui:gtsdk:3.3.15.0'  // 个推SDK
implementation 'com.getui:gtc:3.3.3.0'  // 个推核心组件
```

插件已配置个推 Maven 仓库。如果主工程使用统一仓库管理，请在对应的仓库配置中添加：

```gradle
maven {
    url "https://mvn.getui.com/nexus/content/repositories/releases/"
}
```


## React Native 0.60+ 配置

1、在 `android/app/src/main/AndroidManifest.xml` 的 `<application>` 标签内添加 AppID：

```xml
<meta-data android:name="GETUI_APPID" android:value="你的 AppID" />
```

也可以在 `android/app/build.gradle` 的 `defaultConfig` 中定义 Manifest 占位符：

```gradle
manifestPlaceholders = [
    GETUI_APP_ID: "你的 AppID"
]
```

对应的 Manifest 配置为：

```xml
<meta-data android:name="GETUI_APPID" android:value="${GETUI_APP_ID}" />
```

2、Autolinking 会自动引入 `react-native-getui`，不需要在 `settings.gradle` 或 `app/build.gradle` 中手动添加项目依赖。

## 旧版非 Autolinking 项目

旧项目可继续使用 `GetuiConfigure` 脚本生成的 `PUSH_APPID`、`PUSH_APPKEY` 和 `PUSH_APPSECRET` 配置，并在 `android/app/build.gradle` 的 `dependencies` 节点中添加：

```gradle
implementation project(':react-native-getui')
```

不要将旧脚本生成的 `compile project(...)` 用于现代 Android Gradle Plugin 项目。

#JS 使用

主要的消息通知回调使用如下，其他的接口均可在 [index.js](https://github.com/GetuiLaboratory/react-native-getui/blob/master/index.js) 查看。

````
//订阅消息通知
   var { NativeAppEventEmitter } = require('react-native');
   var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
      'receiveRemoteNotification',
      (notification) => {
        //消息类型分为 cmd 和 payload 透传消息，具体的消息体格式会有差异
        switch (notification.type) {
            case "cid":
                Alert.alert('初始化获取到cid',JSON.stringify(notification))
                break;
            case "cmd":
                Alert.alert('cmd 消息通知',JSON.stringify(notification))
                break;
            case "payload":
                Alert.alert('payload 消息通知',JSON.stringify(notification))
                break;
            //新增回调通知到达，点击回调
            case 'notificationArrived':
                Alert.alert('notificationArrived 通知到达',JSON.stringify(notification))
                break
            case 'notificationClicked':
                Alert.alert('notificationArrived 通知点击',JSON.stringify(notification))
                break
            default:
        }
      }
    );


````

````
componentWillUnMount() {
  //记得在此处移除监听
    receiveRemoteNotificationSub.remove()
}

````

其他接口：

````
import Getui from 'react-native-getui'

   Getui.initPush()
   
  Getui.clientId((param)=> {
       this.setState({'clientId': param})
   })

   Getui.version((param)=> {
       this.setState({'version': param})
   })

   Getui.status((param)=> {
       let status = ''
       switch (param){
           case '0':
               status = '正在启动'
               break;
           case '1':
               status = '启动'
               break;
           case '2':
               status = '停止'
               break;
       }
       this.setState({'status': status})
   })
//Getui...

````
