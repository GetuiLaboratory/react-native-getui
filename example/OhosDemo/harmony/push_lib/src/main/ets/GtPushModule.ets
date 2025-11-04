// entry/src/main/ets/turbomodule/CalculatorModule.ts
import { AnyThreadTurboModule, UITurboModule } from '@rnoh/react-native-openharmony/ts';

import { common } from '@kit.AbilityKit';
import { RNOHContext, UITurboModuleContext } from '@rnoh/react-native-openharmony/src/main/ets/RNOH/ts';
import hilog from '@ohos.hilog';
import PushManager, { GTTransmitMessage, GTCmdMessage, Tag, GTNotificationMessage, GTPushCallback } from "@getui/push"
import { JSON } from '@kit.ArkTS';
import { notificationManager } from '@kit.NotificationKit';

let TAG = "GtPushModule"

export class GtPushModule extends UITurboModule {
  protected _context: common.UIAbilityContext;
  protected _RnContext: RNOHContext;
  protected gtcId: string = '';


  constructor(ctx: UITurboModuleContext) {
    super(ctx);
    this._context = ctx?.uiAbilityContext;
    this._RnContext = ctx;

  }

  version(cb: (param: string) => void): void {
    cb(PushManager.getSDKVersion())
  }

  initPush(): void {
    notificationManager.requestEnableNotification().then(() => {
      hilog.debug(0x0000, "notify", '%{public}s', 'requestEnableNotification success');
    }).catch((err: Error) => {
      hilog.debug(0x0000, "notify", '%{public}s', "error = " + err.message);
    })
    //会导致崩溃
    // this.onSuccess =onSuccess;
    // this.onFailed =onFailed;

    PushManager.setPushCallback(this.myGTPushCallback)
    PushManager.initialize({
      context: this._context,
      onSuccess: (cid: string) => {
        hilog.debug(0x0000, TAG, '%{public}s', "cid = " + cid);
        //this.onSuccess(cid)
      },
      onFailed: (error: string) => {
        hilog.debug(0x0000, TAG, '%{public}s', "error = " + error);
        //this.onFailed(error)
      }
    })

  }

  turnOnPush(): void {
    PushManager.turnOnPush()
  }

  turnOffPush(): void {
    PushManager.turnOffPush()
  }

  clientId(cb: (param: string) => void): void {
    cb(PushManager.getClientId())
  }

  setBackgroundOffLine(offLine: boolean): void {
    PushManager.setBackgroundOffLine(offLine)
  }

  bindAlias(alias: string, aSn: string): void {
    PushManager.bindAlias(alias, aSn)
  }

  unbindAlias(alias: string, isSelf: boolean, aSn: string): void {
    PushManager.unBindAlias(alias, isSelf, aSn)
  }

  setTag(tags: string[], sn: string): void {
    const tagArray = new Array<Tag>()
    for (const name of tags) {
      const tag = new Tag().setName(name)
      tagArray.push(tag)

    }
    hilog.debug(0x0000, TAG, '%{public}s', "setTag sn = " + sn);
    PushManager.setTag(tagArray, sn)
  }

  queryTag(sn: string): void {
    hilog.debug(0x0000, TAG, '%{public}s', "queryTag sn = " + sn);
    PushManager.queryTag(sn)
  }

  sendFeedbackMessage(actionId: number, taskId: string, msgId: string): void {
    PushManager.sendFeedbackMessage(taskId, msgId, actionId)
  }

  setSilentTime(beginHour: number, duration: number): boolean {
    return PushManager.setSilentTime(beginHour, duration);
  }

  setBadgeBum(badge: number): void {
    PushManager.setBadgeNum(badge)
  }


  protected myGTPushCallback :GTPushCallback = {
    onReceiveClientId: (clientId: string) => {
      hilog.debug(0x0000, TAG, '%{public}s', "onReceiveClientId = " + clientId);
      this._RnContext?.rnInstance?.emitDeviceEvent('onReceiveClientId', clientId);
    },
    onReceiveDeviceToken: (token: string) => {
      hilog.debug(0x0000, TAG, '%{public}s', "onReceiveDeviceToken = " + token);
      this._RnContext?.rnInstance?.emitDeviceEvent('onReceiveDeviceToken', token);
    },

    onReceiveOnlineState: (onLine: boolean) => {
      hilog.debug(0x0000, TAG, '%{public}s', "onReceiveOnlineState = " + onLine);
      this._RnContext?.rnInstance?.emitDeviceEvent('onReceiveOnlineState', onLine);
    },

    onReceiveCommandResult: (result: GTCmdMessage) => {
      let msg = JSON.stringify(result);
      hilog.debug(0x0000, TAG, '%{public}s', "onReceiveCommandResult = " + msg);
      this._RnContext?.rnInstance?.emitDeviceEvent('onReceiveCommandResult', msg);
    },
    onReceiveMessageData: (message: GTTransmitMessage) => {
      let msg = JSON.stringify(message);
      hilog.debug(0x0000, TAG, '%{public}s', "onReceiveMessageData = " + msg);

      this._RnContext?.rnInstance?.emitDeviceEvent('onReceiveMessageData', msg);
    },

    onNotificationMessageArrived: (message: GTNotificationMessage) => {
      let msg = JSON.stringify(message);
      hilog.debug(0x0000, TAG, '%{public}s', "onNotificationMessageArrived = " + msg);
      this._RnContext?.rnInstance?.emitDeviceEvent('onNotificationMessageArrived', msg);
    },
    onNotificationMessageClicked: (message: GTNotificationMessage) => {
      let msg = JSON.stringify(message);
      hilog.debug(0x0000, TAG, '%{public}s', "onNotificationMessageClicked = " + msg);
      this._RnContext?.rnInstance?.emitDeviceEvent('onNotificationMessageClicked', msg);
    }
  }
}




