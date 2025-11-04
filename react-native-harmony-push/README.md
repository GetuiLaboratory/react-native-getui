 [Github 地址](https://github.com/GetuiLaboratory/react-native-idosdk/tree/main/react-native-harmony-ido)

## 安装与使用
* 下载鸿蒙插件工程[gt-push-ohos-plugin-1.0.0.tgz](gt-ido-ohos-plugin-1.0.0.tgz)
* 将gt-push-ohos-plugin-1.0.1.tgz放到RN工程下
* 安装 , 如:npm install file:gt-push-ohos-plugin/gt-push-ohos-plugin-1.0.0.tgz


下面的代码展示了这个库的基本使用场景：
完成代码参考[App.tsx](../example/OhosDemo/App.tsx)

> [!WARNING] 使用时 import 的库名不变。

```js
import { GetuiIdo } from "gt-ido-ohos-plugin";
//....省略
function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [gtcid, setGtcid] = useState<string | null>(null); // 存储 gtcid
    const [version, setVersion] = useState<string>('未知'); // 存储版本号
    
    // 初始化运营工具
    const initIdo = () => {
        try {
            // 获取版本号
            GetuiIdo.version((ver: string) => {
                setVersion(ver);
            });

            const appId = 'djYjSlFVMf6p5YOy2OQUs8';
            const channel = 'rn';
            GetuiIdo.setDebugEnable(true)

            GetuiIdo.startSdk(appId, channel);

            setTimeout((): void => {
                // 获取 gtcid
                GetuiIdo.gtcid((id: string) => {
                    Alert.alert('成功', '运营工具初始化成功 \n '+id);
                    setGtcid(id);
                });
            }, 1000);
            
            // 开启调试模式（可选）
            GetuiIdo.setDebugEnable(true);
            // 设置其他可选配置（根据需求调整，时间单位为毫秒）
            GetuiIdo.setSessionTime(30000); // 设置会话时间（毫秒）
            GetuiIdo.setMinAppActiveDuration(60000); // 设置最小活跃时长（毫秒）
            GetuiIdo.setMaxAppActiveDuration(3600000); // 设置最大活跃时长（毫秒）
            GetuiIdo.setEventUploadInterval(300000); // 设置事件上传间隔（毫秒）
            GetuiIdo.setEventForceUploadSize(50); // 设置强制上传事件数量
            GetuiIdo.setProfileUploadInterval(600000); // 设置用户画像上传间隔（毫秒）
            GetuiIdo.setProfileForceUploadSize(20); // 设置用户画像强制上传数量

            const profiles = {
                "userId": 123,
                "name": "Alice",
                "isActive": true
            };

            GetuiIdo.setProfile(profiles,  "sss");
        } catch (error) {
            Alert.alert('错误', '初始化运营工具失败: ' + error);
        }
    };
    const trackCountEvent = () =>{
        const profiles = {
            "userId": 123,
            "name": "Alice",
            "isActive": true
        };

        GetuiIdo.trackCountEvent("123",profiles,"ss");
    };
);
}
//....省略
export default App;

```

## Link

目前 HarmonyOS 暂不支持 AutoLink，所以 Link 步骤需要手动配置。

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
    "IdoOhosSdk": "file:../../node_modules/gt-ido-ohos-plugin/harmony/IdoOhosSdk.har"
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
add_subdirectory("${OH_MODULE_DIR}/IdoOhosSdk/src/main/cpp" ./ido)

add_library(rnoh_app SHARED
   "./PackageProvider.cpp"
   "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
 )

target_link_libraries(rnoh_app PUBLIC rnoh)
target_link_libraries(rnoh_app PUBLIC rnoh_ido)
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"  
#include "IdoPackage.h"

using namespace rnoh;  
std::vector<std::shared_ptr<Package>> 
PackageProvider::getPackages(Package::Context ctx) {
   return {
          std::make_shared<IdoPackage>(ctx)
   };
}
```

### 4.在 ArkTs 侧引入 NetInfoPackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import  { IdoPackage } from 'IdoOhosSdk/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new IdoPackage(ctx),
  ];
}
```

### 5.配置appid参数

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

startSdk(appid: string, channel: string): void;

gtcid(cb: (param: string) => void): void;

version(cb: (param: string) => void): void;

setDebugEnable(isEnable: boolean): void;

setSessionTime(time: number): void;

setMinAppActiveDuration(val: number): void;

setMaxAppActiveDuration(val: number): void;

setEventUploadInterval(val: number): void;

setEventForceUploadSize(val: number): void;

setProfileUploadInterval(val: number): void;

setProfileForceUploadSize(val: number): void;

setUserId(val: string): void;

trackCustomKeyValueEventBegin(eventId: string): void;

trackCustomKeyValueEventEnd(eventId: string, args:{[key: string]: string|number|boolean}, ext: string): void;

trackCountEvent(eventId: string, args:{[key: string]: string|number|boolean}, ext: string): void;

setProfile(profiles: {[key: string]: string|number|boolean}, ext: string): void;

}
```