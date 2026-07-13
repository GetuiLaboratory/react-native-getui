# AndroidDemo

`AndroidDemo` 使用 `react-native-getui@1.1.56`、React Native `0.82.1` 和 React `19.1.1` 验证过 Android 构建、安装和个推初始化。

## 本地运行

```bash
cd example/AndroidDemo
npm ci
adb reverse tcp:8081 tcp:8081
npm start -- --reset-cache
```

另开一个终端，构建并安装 Debug 包：

```bash
cd example/AndroidDemo/android
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.androiddemo/.MainActivity
```

保持 Metro 服务运行。真机通过 USB 调试时，`adb reverse tcp:8081 tcp:8081` 用于让 Debug 包访问本机 Metro；未启动 Metro 会显示 "Unable to load script"。

## 本地插件引用

Demo 使用 `"react-native-getui": "file:../.."` 引用仓库根目录。`metro.config.js` 已配置该目录的 `watchFolders`、`nodeModulesPaths` 和模块映射，React Native `0.82.1` 可正确打包本地插件及其依赖。

## 个推配置

AppID 位于 `android/app/src/main/AndroidManifest.xml`：

```xml
<meta-data android:name="GETUI_APPID" android:value="你的 AppID" />
```

安装后点击“初始化(仅ANDROID)”；页面显示 CID 即表示 SDK 注册成功。
