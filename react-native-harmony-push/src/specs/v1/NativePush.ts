// NativeCalculator.ts
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';


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

export default TurboModuleRegistry.get<Spec>(
  'GtPushModule',
) as Spec | null;