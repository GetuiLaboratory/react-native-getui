# react-native-getui
react-native-getui 是个推官方开发的 React Native 插件，使用该插件可以方便快速地集成推送功能。


#Env

- React Native Version ： Lastest
- react-native-getui > 1.1.2

#Installation

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
- 在 Android工程中需要在Application或MainActivity的onCreate中调用
````
GetuiModule.initPush(this);
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

4、
[Android Studio 工程配置](https://github.com/GetuiLaboratory/react-native-getui/blob/master/example/document/android.md)

5、在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：
````
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
````
