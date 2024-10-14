/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Button, Alert } from 'react-native';

import Getui from 'react-native-getui';


//监听方式一：
// import { NativeEventEmitter, NativeModules } from 'react-native';
// const { GetuiModule } = NativeModules;
// const GetuiEmitter = new NativeEventEmitter(NativeModules.GetuiModule);
// const subscription = GetuiEmitter.addListener(
//   'GeTuiSdkDidRegisterClient',
//   (message) => {
//     console.log("receive cid " + message)
//   }
// );
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

// 为每个事件创建一个封装的回调函数
names.forEach((eventName) => {
  console.log(`Adding listener for ${eventName}`);
  NativeAppEventEmitter.addListener(eventName, (message: any) => listenerCallBack(eventName, message));
});


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const handlePress = () => {
    Getui.clientId((cid) => {
      Alert.alert('Client ID:', cid)
    });
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

          <Section title="GTSDK APIs">
            <Button
              title="clientId"
              onPress={handlePress}
            />
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
          </Section>
          <Section title="Tags">
            <Button
              title="setTag"
              onPress={() => {
                const tags = ["tag1", "tag2"];
                const result = Getui.setTag(tags);
                console.log("Set tag result:", result);
              }}
              //需要监听回调GeTuiSdkDidSetTags
            />
          </Section>
          <Section title="Alias">
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
          </Section>
          <Section title="SendMsg">
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
          </Section>

          <Section title="Switch">
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
          </Section>
          <Section title="Badge">
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
          </Section>
          <Section title="LiveActivity">
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
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
