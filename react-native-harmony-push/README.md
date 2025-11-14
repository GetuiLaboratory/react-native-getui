 [Github 地址](https://github.com/GetuiLaboratory/react-native-getui/tree/master/react-native-harmony-push)

## 安装与使用
* 下载鸿蒙插件工程[gt-push-ohos-plugin-1.0.0.tgz](gt-push-ohos-plugin-1.0.0.tgz)
* 将gt-push-ohos-plugin-1.0.0.tgz放到RN工程下
* 安装 , 如:npm install file:gt-push-ohos-plugin/gt-push-ohos-plugin-1.0.0.tgz


下面的代码展示了这个库的基本使用场景：
完成代码参考[App.tsx](../example/OhosDemo/App.tsx)

> [!WARNING] 使用时 import 的库名不变。

```js
import { GetuiPush } from 'gt-push-ohos-plugin';
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
//....省略
export default App;

```

## Link

目前 HarmonyOS 暂不支持 AutoLink，所以 Link 步骤需要手动配置。
建议参考鸿蒙官网教程[RN应用鸿蒙化开发指南](https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/应用开发实践/RN应用鸿蒙化开发指南.md#rn应用鸿蒙化开发指南)

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`

### 1.在工程根目录的 `oh-package.json5` 添加 overrides 字段

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
}
```

### 2.引入原生端代码

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "0.72.90",
    "GtPushOhosSdk": "file:../../node_modules/gt-push-ohos-plugin/harmony/GtPushOhosSdk.har"
  }
```
点击右上角的 `sync` 按钮


### 3.配置 CMakeLists 和引入 IdoPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(OH_MODULE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")

set(RNOH_CPP_DIR "${OH_MODULE_DIR}/@rnoh/react-native-openharmony/src/main/cpp")
set(RNOH_GENERATED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/generated")
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
add_compile_definitions(WITH_HITRACE_SYSTRACE)
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use

add_subdirectory("${RNOH_CPP_DIR}" ./rn)
add_subdirectory("${OH_MODULE_DIR}/GtPushOhosSdk/src/main/cpp" ./gtpsuh)

add_library(rnoh_app SHARED
   "./PackageProvider.cpp"
   "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
 )

target_link_libraries(rnoh_app PUBLIC rnoh)
target_link_libraries(rnoh_app PUBLIC rnoh_gtpush)
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"  
#include "GtPushPackage.h"  

using namespace rnoh;  
std::vector<std::shared_ptr<Package>> 
PackageProvider::getPackages(Package::Context ctx) {
   return {
          std::make_shared<GtPushPackage>(ctx)
   };
}
```

### 4.在 ArkTs 侧引入 NetInfoPackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import  { GtPushPackage } from 'GtPushOhosSdk/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new GtPushPackage(ctx),
  ];
}
```

### 5.补全通知点击报表
```diff
import {GtPushModule} from 'GtPushOhosSdk';

export default class EntryAbility extends RNAbility {
    onCreate(want: Want): void {
        super.onCreate(want)
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
        //补充点击事件报表
        GtPushModule.setClickWant(want)
    }
    
    onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        //补充点击事件报表
        GtPushModule.setClickWant(want)
    }
}
```

### 6.配置appid参数

打开 `entry/src/main/module.json5`，添加：

```diff
    "metadata": [
      {
        "name": "GETUI_APPID",
        "value": "djYjSlFVMf6p5YOy2OQUs8"//你的APPID个推官网申请
      },

    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.GET_NETWORK_INFO"
      },
      {
        "name": "ohos.permission.GET_WIFI_INFO"
      },
      {
        "name": "ohos.permission.APP_TRACKING_CONSENT",
        "reason" : "$string:oaid_reason",
        "usedScene": {
          "when": "always"
        }
      }
    ]
```

### 6.运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

## 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。


## 方法

```ts
export interface Spec extends TurboModule {

  /**
   * 初始化推送服务 只有Android,  IOS在AppDelegate中初始化
   */
   initPush(): void;

  /**
   * 打开推送服务
   */
   turnOnPush(): void;

   turnOffPush(): void;

  /**
   * 获取SDK的Cid
   *
   * @param cb 回调函数，接收 Cid 值
   */
   clientId(cb: (param: string) => void): void;


  /**
   * 获取SDK版本号
   *
   * @param cb 回调函数，接收版本值
   */
   version(cb: (param: string) => void): void;

  /**
   * 是否让SDK 后台离线（默认值：true）
   *
   * @param offLine 支持当APP进入后台后，个推是否离线,true.离线
   */
   setBackgroundOffLine(offLine: boolean): void;

  /**
   * 绑定别名功能:后台可以根据别名进行推送
   *
   * @param alias 别名字符串
   * @param aSn 绑定序列码, 不为nil
   */
   bindAlias(alias: string, aSn?: string): void;

  /**
   * 取消绑定别名功能
   *
   * @param alias 别名字符串
   * @param isSelf 是否只对当前cid有效. true: 只对当前cid做解绑；false:对所有绑定该别名的cid列表做解绑.
   * @param aSn 绑定序列码, 不为nil
   */
   unbindAlias(alias: string, isSelf: boolean, aSn?: string): void;

  /**
   * 给用户打标签 , 后台可以根据标签进行推送
   *
   * @param tags 别名数组
   *
   * @return 提交结果，YES表示尝试提交成功，NO表示尝试提交失败
   */
   setTag(tags: string[], sn:string):void;

   queryTag(sn:string):void;
  /**
   * 上行第三方自定义回执actionid
   *
   * @param actionId 用户自定义的actionid，int类型，取值90001-90999。
   * @param taskId 下发任务的任务ID
   * @param msgId 下发任务的消息ID
   * 该方法需要在回调方法“GeTuiSdkDidReceivePayload:andTaskId:andMessageId:andOffLine:fromApplication:”使用
   */
   sendFeedbackMessage(actionId: number, taskId: string, msgId: string): void;

   /**
    * 设置静默时间.
    *
    * @param beginHour 开始时间，beginHour >= 0 && beginHour < 24，单位 h.
    * @param duration  持续时间，duration > 0 && duration <= 23，持续时间为 0 则取消静默，单位 h.
    * @return 不是真正调用结果, 仅仅是该方法是否调用成功.
    */
   setSilentTime(beginHour: number, duration: number): boolean;


   setBadgeNum(badgeNum: number):void;


}
```

## 设置事件监听

```ts
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
```