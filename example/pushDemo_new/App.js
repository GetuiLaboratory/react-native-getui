/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Alert, Button } from 'react-native';

import { Container, Content, Card, CardItem, Text } from 'native-base';
import Getui from 'react-native-getui';

export default class App extends Component {
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      clientId: '',
      version: '',
      status: '',
    };
  }

  componentWillMount() {
    this.updateComponentInfo();
  }

  handleTurnOn = () => {
    Getui.turnOnPush();
  };

  handleTurnOff = () => {
    Getui.turnOffPush();
  };

  render() {
    return (
      <View style={styles.container}>
        <Container>
          <Content>
            <Card>
              <CardItem>
                <Text>Version : {this.state.version}</Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Text>ClientId : {this.state.clientId}</Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Text>运行状态 : {this.state.status}</Text>
              </CardItem>
            </Card>
          </Content>
          <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
            <Button title="turnOn" onPress={this.handleTurnOn} />
            <Button title="turnOff" onPress={this.handleTurnOff} />
          </View>
        </Container>
      </View>
    );
  }

  componentDidMount() {
    this.updateComponentInfo();
  }

  updateComponentInfo() {
    Getui.clientId((param) => {
      this.setState({ clientId: param });
    });

    Getui.version((param) => {
      this.setState({ version: param });
    });

    Getui.status((param) => {
      let status = '';
      switch (param) {
        case '0':
          status = '正在启动';
          break;
        case '1':
          status = '启动';
          break;
        case '2':
          status = '停止';
          break;
      }
      this.setState({ status: status });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 20,
  },
  content: {
    marginTop: 60,
  },
});

//订阅消息通知
var { NativeAppEventEmitter } = require('react-native');

var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
  'receiveRemoteNotification',
  (notification) => {
    //Android的消息类型为payload 透传消息 或者 cmd消息
    switch (notification.type) {
      case 'cid':
        //  console.log("receiveRemoteNotification cid = " + notification.cid)
        Alert.alert('初始化获取到cid', JSON.stringify(notification));
        break;
      case 'payload':
        Alert.alert('payload 消息通知', JSON.stringify(notification));
        break;
      case 'cmd':
        Alert.alert('cmd 消息通知', 'cmd action = ' + notification.cmd);
        break;
      case 'notificationArrived':
        Alert.alert(
          'notificationArrived 通知到达',
          JSON.stringify(notification)
        );
        break;
      case 'notificationClicked':
        Alert.alert(
          'notificationArrived 通知点击',
          JSON.stringify(notification)
        );
        break;
      default:
    }
  }
);

var clickRemoteNotificationSub = NativeAppEventEmitter.addListener(
  'clickRemoteNotification',
  (notification) => {
    Alert.alert('点击通知', JSON.stringify(notification));
  }
);
