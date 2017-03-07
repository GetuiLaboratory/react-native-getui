#Android usage
在 react-native link 之后， 使用Android Studio打开工程。


1、app/build.gradle 的defaultConfig节点中添加如下代码

````
// 配置个推的三个参数
manifestPlaceholders = [
            GETUI_APP_ID : "DI1jwW3FtZ6kGDeY5dk0Y9",
            GETUI_APP_KEY : "DQCk2V8Jev9hqhWDU94PF9",
            GETUI_APP_SECRET : "Rtyp5trKUt8HSyzD8zRXX7"
        ]


````
#JS 使用

主要的消息通知回调使用如下，其他的接口均可在 [index.js](https://github.com/GetuiLaboratory/react-native-getui/blob/master/index.js) 查看。

````
//订阅消息通知
   var { NativeAppEventEmitter } = require('react-native');
   var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
      'receiveRemoteNotification',
      (notification) => {
        //消息类型分为 APNs 和 payload 透传消息，具体的消息体格式会有差异
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

    var clickRemoteNotificationSub = NativeAppEventEmitter.addListener(
        'clickRemoteNotification',
        (notification) => {
            Alert.alert('点击通知',JSON.stringify(notification))
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