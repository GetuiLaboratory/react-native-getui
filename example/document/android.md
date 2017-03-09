#Android usage
在 react-native link 之后， 使用Android Studio打开工程（假设主模块名称为app）。

1、使用 Android Studio import 你的 React Native 应用（选择你的 React Native 应用所在目录下的 android 文件夹即可）

2、android/app/build.gradle 的defaultConfig节点中添加如下代码

````
// 配置个推的三个参数
manifestPlaceholders = [
            GETUI_APP_ID : "你的AppID",
            GETUI_APP_KEY : "你的AppKey",
            GETUI_APP_SECRET : "你的AppSecret"
        ]

````

3、在android/app/AndroidManifest.xml 中添加meta-data

````
<!-- 配置个推的三个参数 -->
<meta-data android:name="PUSH_APPID" android:value="${GETUI_APP_ID}" />
<meta-data android:name="PUSH_APPKEY" android:value="${GETUI_APP_KEY}" />
<meta-data android:name="PUSH_APPSECRET" android:value="${GETUI_APP_SECRET}" />

````

4、在android/app/build.gradle中添加对react-native-getui的依赖（如果已经存在，忽略此步）

````
compile project(':react-native-getui')

````

5、在Application.onCreate或MainActivity.onCreate中初始化个推

````
GetuiModule.initPush(this);

````

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
            case "cmd":
                Alert.alert('cmd 消息通知',JSON.stringify(notification))
                break;
            case "payload":
                Alert.alert('payload 消息通知',JSON.stringify(notification))
                break;
            default:
        }
      }
    );
 
    
````

````
componentWillUnMount() {
  //记得在此处移除监听
    receiveRemoteNotificationSub.remove()
    clickRemoteNotificationSub.remove()
}

````

其他接口：

````
import Getui from 'react-native-getui'

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