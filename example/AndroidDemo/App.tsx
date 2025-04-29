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
  Alert
} from 'react-native';
import Getui from 'react-native-getui';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// 定义事件参数类型（根据个推实际返回结构调整）
interface EventParams {
  type: 'cid' | 'payload' | 'cmd' | 'notificationArrived' | 'notificationClicked';
  cid?: string; // 当type为'cid'时，包含设备标识
  cmd?: string; // 当type为'cmd'时，包含指令
  [key: string]: any; // 允许其他动态字段
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const eventListener = useRef<EmitterSubscription | null>(null);
  const [cid, setCid] = useState(""); // 修正：状态声明为[状态值, 更新函数]
  const [version, setVersion] = useState(""); // 修正：状态声明为[状态值, 更新函数]

  // 初始化推送服务
  const initPush = (): void => {
    Getui.initPush();
  };

  // 设置事件监听
  const setCallback = (): void => {
    eventListener.current = DeviceEventEmitter.addListener(
      'receiveRemoteNotification',
      (params: EventParams) => {
        switch (params.type) {
          case 'cid':
            if (params.cid) {
              setCid(params.cid); // 修正：调用状态更新函数
              Alert.alert('初始化获取到cid', params.cid);
            }
            break;
          case 'payload':
            Alert.alert('payload 消息通知', JSON.stringify(params, null, 2));
            break;
          case 'cmd':
            Alert.alert('cmd 消息通知', `cmd action = ${params.cmd || '无指令'}`);
            break;
          case 'notificationArrived':
            Alert.alert(
              'notificationArrived 通知到达',
              JSON.stringify(params, null, 2)
            );
            break;
          case 'notificationClicked':
            Alert.alert(
              'notificationClicked 通知点击',
              JSON.stringify(params, null, 2)
            );
            break;
          default:
            Alert.alert('未知事件类型', `原始参数：${JSON.stringify(params)}`);
        }
      }
    );
  };

  // 组件生命周期管理
  useEffect(() => {
    setCallback();
    Getui.version((version) => {
        setVersion(version)
    })

    // 卸载时清理监听
    return () => {
      eventListener.current?.remove();
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

          <Button title="初始化(仅Android)" onPress={initPush} />
          {cid ? (
            <Text style={styles.cidText}>当前设备CID：{cid}</Text>
          ) : (
            <Text style={styles.cidText}>未获取到CID</Text>
          )}
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
