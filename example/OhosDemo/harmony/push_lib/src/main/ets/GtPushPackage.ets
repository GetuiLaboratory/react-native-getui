// entry/src/main/ets/GeneratedPackage.ets
import {
  RNOHPackage,
  AnyThreadTurboModule,
  AnyThreadTurboModuleContext,
  UITurboModule,
  UITurboModuleContext
} from '@rnoh/react-native-openharmony';


import { GtPushModule } from './GtPushModule';

export  class GtPushPackage extends RNOHPackage {
  override getUITurboModuleFactoryByNameMap(): Map<string, (ctx: UITurboModuleContext) => UITurboModule | null> {
    return new Map<string, ((ctx: UITurboModuleContext) => UITurboModule)>()
      .set("GtPushModule", (ctx) => new GtPushModule(ctx))
  }


  override async createEagerUITurboModuleByNameMap(ctx: UITurboModuleContext): Promise<Map<string, UITurboModule>> {
    const calculatorModule = new GtPushModule(ctx);
    return new Map()
      .set("GtPushModule", calculatorModule)
  }
}