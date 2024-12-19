/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Getui from 'react-native-getui';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Button
                title="Press me"
                onPress={onButtonPress}
              />
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const onButtonPress = () => {
  Alert.alert("Hello");
  

  Getui.version((param) => {
    // this.setState({ version: param });
    Alert.alert(param);
  });

};

// 监听方式二：
var { NativeAppEventEmitter } = require('react-native');
let names = [
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
const listenerCallBack = (eventName, message) => {
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
  NativeAppEventEmitter.addListener(eventName, (message) => listenerCallBack(eventName, message));
});


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
