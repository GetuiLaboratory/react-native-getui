/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Alert
} from 'react-native';
import {Container, Content, Card, CardItem, Text} from 'native-base';
import Getui from 'react-native-getui'

export default class pushDemo extends Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            clientId: '',
            version:'',
            status:''
        };
    }

    componentDidMount() {
        this.updateComponentInfo()

        //  注册 VoIP 通知
       Getui.voipRegistration();

       //订阅消息通知
       var { NativeAppEventEmitter } = require('react-native');
       var resigsteClientIdSub = NativeAppEventEmitter.addListener(
         'GeTuiSdkDidRegisterClient',
         (clientId) => {
           Alert.alert(clientId);
           this.setState({
                status:'已启动'
            })
         }
         
       )
       var receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
          'GeTuiSdkDidReceiveSlience',
          (notification) => {
              /// 收到透传消息
              /// 推送消息内容
              /// @param fromGetui   YES: 个推通道  NO：苹果apns通道
              /// @param offLine     是否是离线消息，YES.是离线消息
              /// @param appId       应用的appId
              /// @param taskId      推送消息的任务id
              /// @param msgId       推送消息的messageid
              /// @param completionHandler 用来在后台状态下进行操作（通过苹果apns通道的消息 才有此参数值）
              Alert.alert('点击通知',JSON.stringify(notification))
          }
        );

        var clickRemoteNotificationSub = NativeAppEventEmitter.addListener(
            'GeTuiSdkDidReceiveNotification',
            (notification) => {
                Alert.alert('点击通知',JSON.stringify(notification))
            }
        );

        var voipPushPayloadSub = 
        NativeAppEventEmitter.addListener(
            'voipPushPayload',
            (notification) => {
                Alert.alert('VoIP 通知： ',JSON.stringify(notification))
            }
        );
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
                   status = '已启动'
                   break;
               case '2':
                   status = '停止'
                   break;
           }
           this.setState({'status': status})
       })
    }

    componentWillUnMount() {
      //记得在此处移除监听
        receiveRemoteNotificationSub.remove()
        clickRemoteNotificationSub.remove()
        resigsteClientIdSub.remove()
        voipPushPayloadSub.remove()
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

AppRegistry.registerComponent('pushDemo', () => pushDemo);
