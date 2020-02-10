import { BaseGenerator, GenerateGlobalInfo } from './BaseGenerator';
import * as _ from 'lodash';

export async function invokeAllGenerator(gs: BaseGenerator[]) {
  // 收集全局信息
  const globalInfoList = await Promise.all(gs.map(g => g.getGlobalInfo()));
  const globalInfo = GenerateGlobalInfo.mergeAll(globalInfoList);

  // 开始生成 list
  const resultList = await Promise.all(gs.map(g => g.generateList(globalInfo)));

  return {
    globalInfo,
    list: _.flatten(resultList),
  };
}
