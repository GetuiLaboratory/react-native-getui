# react-native-getui
react-native-getui 是个推官方开发的 React Native 插件，使用该插件可以方便快速地集成推送功能。

目前只有 iOS 版本，Android 版本将会在近期推出，暂时请 Android 的小伙伴们使用原生的方式接入，一样简单方便。

#Env

- React Native Version ： Lastest
- react-native-getui > 1.0.2

#Installation

##iOS
###使用 rnpm 自动安装

````
npm install react-native-getui -save
````
````
react-native link
````
````
npm run GetuiConfigure <yourModuleName> <yourAppId> <yourAppKey> <yourAppSecret>
````
#### Note:
- yourAppId/yourAppKey/yourAppSecret 需要去 [个推官网](https://dev.getui.com) 注册后，在后台配置获取。

- 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：
````
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
````

###Manually
1、
````
npm install react-native-getui -save
````

2、
````
react-native link
````

3、
[Xcode 工程配置](https://github.com/GetuiLaboratory/react-native-getui/blob/master/example/document/iOS.md)

4、在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：
````
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
````
