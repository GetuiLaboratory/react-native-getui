/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Alert
} from 'react-native';

import {Container, Content, Card, CardItem, Text} from 'native-base';
import Getui from 'react-native-getui'



export default class pushDemo extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            clientId: '',
            version:'',
            status:''
        };

    }

    componentWillMount() {
        //订阅消息通知
        this.updateComponentInfo()

    }
    render() {
        return (
            <View style={styles.container}>
                <Container>
                    <Content >
                        <Card>
                            <CardItem>
                                <Text>
                                    Version : {this.state.version}
                                </Text>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Text>
                                    ClientId : {this.state.clientId}
                                </Text>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Text>
                                    运行状态 : {this.state.status}
                                </Text>
                            </CardItem>
                        </Card>

                    </Content>

                </Container>
            </View>
        );
    }

    componentDidMount(){
        this.updateComponentInfo()
    }

  updateComponentInfo (){

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
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop:20
    },
    content: {
        marginTop: 60
    }
});

var { NativeAppEventEmitter } = require('react-native');

                var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
                    'receiveRemoteNotification',
                    (notification) => {
                        //Android的消息类型为payload 透传消息 或者 cmd消息
                        switch (notification.type) {
                            case "cid":
                                Alert.alert('初始化获取到cid',JSON.stringify(notification))
                                break;
                            case 'payload':
                                Alert.alert('payload 消息通知',JSON.stringify(notification))
                                break
                            case 'cmd':
                                Alert.alert('cmd 消息通知', 'Cmd action = ' + notification.cmd)
                                break
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
AppRegistry.registerComponent('pushDemo', () => pushDemo);

