import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import  { GtPushPackage } from 'GtPushOhosSdk/ts';




export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new GtPushPackage(ctx),
  ];
}