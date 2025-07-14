import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  Button,
  Alert,
  useColorScheme,
  StyleSheet,
  ScrollView,
  Text,
  NativeEventEmitter
} from 'react-native';

import Getui from 'react-native-getui';

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

// 为每个事件创建一个封装的回调函数
names.forEach((eventName) => {
  console.log(`Adding listener for ${eventName}`);
  NativeAppEventEmitter.addListener(eventName, (message: any) => listenerCallBack(eventName, message));
});
// Getui.clearAllNotificationForNotificationBar()
// Getui.resume() //test. 

function App() {
  useEffect(() => {
    // const getuiEmitter = new NativeEventEmitter(GetuiModule);
    // const clientRegisterListener = getuiEmitter.addListener(
    //   'GeTuiSdkDidRegisterClient',
    //   (event) => {
    //     console.log('个推客户端注册成功:', event);
    //     Alert.alert('个推客户端注册成功:', JSON.stringify(event));
    //   }
    // );
    // console.log('监听器数量:', getuiEmitter.listenerCount('GeTuiSdkDidRegisterClient'));

    return () => {
      // clientRegisterListener.remove(); // 清理监听器
    };
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  // 抽象颜色配置（根据深色/浅色模式动态返回颜色）
  const getColors = (isDarkMode: boolean) => ({
    text: isDarkMode ? '#fff' : '#000',
    button: isDarkMode ? '#2196F3' : '#007AFF',
    background: isDarkMode ? '#121212' : '#f5f5f5',
    header: isDarkMode ? '#1e1e1e' : '#e0e0e0'
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* 标题 */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          功能列表
        </Text>
      </View>

      {/* 按钮列 */}
      <View style={styles.buttonsContainer}>

        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          GTSDK APIs
        </Text>
        <Button
          key={1}
          title="clientId"
          onPress={() => {
            Getui.clientId((cid) => {
              Alert.alert('Client ID:', cid)
            });
          }}
          color={getColors(isDarkMode).button}

        />

        {/* 按钮 2 */}
        <Button
          title="version"
          onPress={() => {
            Getui.version((version) => {
              console.log("SDK Version:", version);
            });
          }}
        />

        <Button
          title="setChannelId"
          onPress={() => {
            Getui.setChannelId("my_channel_id");
          }}
        />
        <Button
          title="sdk status"
          onPress={() => {
            Getui.status((status) => {
              console.log("SDK Status:", status);
            });
          }}
        />
        <Button
          title="runBackgroundEnable"
          onPress={() => {
            Getui.runBackgroundEnable(true);
          }}
        />
        <Button
          title="lbsLocationEnable"
          onPress={() => {
            Getui.lbsLocationEnable(true, false);
          }}
        />
        <Button
          title="registerDeviceToken"
          onPress={() => {
            Getui.registerDeviceToken("device_token");
          }}
        />

        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          Tags
        </Text>
        <Button
          title="setTag"
          onPress={() => {
            const tags = ["tag1", "tag2"];
            const result = Getui.setTag(tags);
            console.log("Set tag result:", result);
          }}
        //需要监听回调GeTuiSdkDidSetTags
        />


        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          Alias
        </Text>
        <Button
          title="bindAlias"
          onPress={() => {
            Getui.bindAlias("alias", "sn");
          }}
        //需要监听回调GeTuiSdkDidAlias
        />
        <Button
          title="unbindAlias"
          onPress={() => {
            Getui.unbindAlias("alias", "sn");
          }}
        //需要监听回调GeTuiSdkDidAlias
        />


        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          SendMsg
        </Text>
        <Button
          title="sendMessage"
          onPress={() => {
            Getui.sendMessage("message_body", (result) => {
              console.log("Send message result:", result);
            });
            //需要监听回调GeTuiSdkDidSendMessage
          }}
        />
        <Button
          title="sendFeedbackMessage"
          onPress={() => {
            Getui.sendFeedbackMessage(90001, "task_id", "msg_id", (result) => {
              console.log("Send feedback message result:", result);
            });
          }}
        />
        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          Switch
        </Text>
        <Button
          title="turnOnPush"
          onPress={() => {
            Getui.turnOnPush();
          }}
        />
        <Button
          title="turnOffPush"
          onPress={() => {
            Getui.turnOffPush();
          }}
        />
        <Button
          title="clearAllNotificationForNotificationBar"
          onPress={() => {
             Getui.clearAllNotificationForNotificationBar()
          }}
        />



        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          Badge
        </Text>
        <Button
          title="setBadge"
          onPress={() => {
            Getui.setBadge(5);
          }}
        />
        <Button
          title="resetBadge"
          onPress={() => {
            Getui.resetBadge();
          }}
        />

        <Text style={[styles.headerText, { color: isDarkMode ? '#000' : '#000' }]}>
          LiveActivity
        </Text>
        <Button
          title="registerLiveActivity"
          onPress={() => {
            Getui.registerLiveActivity("liveActivityId", "token", "sn", (result) => {
              console.log("registerLiveActivity result:", result);
            });
            //需要监听回调GeTuiSdkDidRegisterLiveActivity
          }}
        />
        <Button
          title="registerPushToStartToken"
          onPress={() => {
            Getui.registerPushToStartToken("activityAttributes", "pushToStartToken", "sn", (result) => {
              console.log("registerPushToStartToken result:", result);
            });
            //需要监听回调GeTuiSdkDidRegisterPushToStartToken
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    width: '100%',
    gap: 15, // 按钮之间的间距
  },
});

export default App;