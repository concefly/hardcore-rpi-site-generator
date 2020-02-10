import * as _ from 'lodash';
import { GenerateGlobalInfo } from '../generator/BaseGenerator';

/** 页面数据 */
export class RenderPageData {
  constructor(
    readonly data: {
      /** 页面标题 */
      title: string;

      /** 页面内容（HTML） */
      content: string;

      createDate: string;
      updateDate: string;

      /** 页面 Meta（由 Page 定义，类型不固定） */
      meta?: any;
    }
  ) {}
}

/** 实际传给 render 渲染的数据（包含全局数据 + 页面数据） */
export class RenderData {
  constructor(
    private readonly generatorType: string,
    private readonly globalInfo: GenerateGlobalInfo,
    private readonly pageData: RenderPageData
  ) {}

  toLocals() {
    return _.cloneDeep({
      ctx: {
        type: this.generatorType,
        data: {
          site: this.globalInfo.data,
          page: this.pageData.data,
        },
      },
    });
  }
}
