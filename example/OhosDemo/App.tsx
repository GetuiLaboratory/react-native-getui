import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  DeviceEventEmitter,
  EmitterSubscription,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';
import { GetuiPush } from 'gt-push-ohos-plugin';
import { Colors } from 'react-native/Libraries/NewAppScreen';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const eventListener = useRef<EmitterSubscription | null>(null);
  const [cid, setCid] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [tag, setTagValue] = useState<string>(''); // 补充缺失的 tag 状态及更新函数

  // 初始化推送服务
  const initPush = (): void => {
    GetuiPush.initPush(
      (cid: string) => {
        console.log('initPush cid : ' + cid);
      },
      (error: string) => {
        console.log('initPush error : ' + error);
      }
    );
  };

  // 设置标签
  const setTag = (): void => {
    GetuiPush.setTag(['李四', '张三'], '123');
  };

  // 查询标签
  const queryTag = (): void => {
    GetuiPush.queryTag('123');
  };

  // 设置事件监听
  const setCallback = (): void => {
    DeviceEventEmitter.addListener('receiveRemoteNotification', (data) => {
      console.log('listener  接收到透传消息 : ' + data);
    });

    DeviceEventEmitter.addListener('onReceiveClientId', (data) => {
      console.log('listener cid : ' + data);
      setCid(data);
    });

    DeviceEventEmitter.addListener('onReceiveDeviceToken', (data) => {
      console.log('listener 厂商token : ' + data);
    });

    DeviceEventEmitter.addListener('onReceiveOnlineState', (data) => {
      console.log('listener 在线状态 : ' + data);
    });

    DeviceEventEmitter.addListener('onReceiveCommandResult', (data) => {
      console.log('listener 指令回执(setTag 、bindAlias...) : ' + data);
      // action
      // SET_TAG_RESULT = 10009;  setTag
      // QUERY_TAG_RESULT = 10012; queryTag
      // BIND_ALIAS_RESULT = 10010; bindAlias
      // UNBIND_ALIAS_RESULT = 10011; unbindAlias
      try {
        const command = JSON.parse(data); // 注意：原代码用了未定义的 jsonString，这里改用 data
        if (command.action === 10012) {
          console.log('listener queryTag : ' + data);
          setTagValue(JSON.stringify(command.tags) )
        }
      } catch (e) {
        console.error('解析 command 数据失败', e);
      }
    });

    DeviceEventEmitter.addListener('onNotificationMessageArrived', (data) => {
      console.log('listener 接受到通知 : ' + data);
    });

    DeviceEventEmitter.addListener('onNotificationMessageClicked', (data) => {
      console.log('listener 通知被点击 : ' + data);
    });

    DeviceEventEmitter.addListener('onNotificationsEnabled', (data) => {
      console.log('listener 系统通知开关状态 : ' + data);
    });
  };

  // 组件生命周期管理
  useEffect(() => {
    setCallback();
    GetuiPush.version((version: string) => {
      setVersion(version);
    });

    // 卸载时清理监听
    return () => {
      // eventListener.current?.remove();
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}
        >
          <Text style={styles.cidText}>当前版本号：{version}</Text>

          <Button title="初始化" onPress={initPush} />
          {cid ? (
            <Text style={styles.cidText}>当前设备CID：{cid}</Text>
          ) : (
            <Text style={styles.cidText}>未获取到CID</Text>
          )}
        <View style={{ marginTop: 16 }}>
             <Button title="setTag" onPress={setTag} />
         </View>
         <View style={{ marginTop: 16 }}>
           <Button title="queryTag" onPress={queryTag} />
           <Text style={styles.cidText}>当前tag：{tag || ''}</Text>
         </View>

        </View>
      </ScrollView>
    </View>
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
  cidText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default App;