import { Collection } from '../collection';
import { BaseTemplateRender } from '../template/BaseTemplateRender';
import { RenderPageData } from '../template/RenderData';

/** generator 上报的信息, 用于声明合并 */
export interface IGenerateGlobalInfoData {}

export interface IRenderListTplItem {
  renderType: 'tpl';
  path: string;
  mime: string;
  renderPageData: RenderPageData;
}

export interface IRenderListRawItem {
  renderType: 'raw';
  path: string;
  mime: string;
  buffer: Buffer;
}

/** 全局信息 */
export class GenerateGlobalInfo {
  /** 浅层合并所有 globalInfo */
  static mergeAll(globalList: GenerateGlobalInfo[]) {
    const mergedGlobalInfo = globalList.reduce(
      (re, gr) => ({ ...re, ...gr.data }),
      {} as IGenerateGlobalInfoData
    );

    return new GenerateGlobalInfo(mergedGlobalInfo);
  }

  constructor(readonly data: IGenerateGlobalInfoData) {}
}

/** 要生成的 list */
export class GenerateList {
  constructor(
    readonly type: string,
    public renderList: (IRenderListTplItem | IRenderListRawItem)[] = []
  ) {}
}

export abstract class BaseGenerator {
  constructor(readonly collection: Collection, readonly templateRender: BaseTemplateRender) {}

  /** 生成器标识(相互不同，主要用于 html 渲染识别) */
  abstract readonly type: string;

  abstract async getGlobalInfo(renderData?: any): Promise<GenerateGlobalInfo>;
  abstract async generateList(
    globalInfo: GenerateGlobalInfo,
    renderData?: any
  ): Promise<GenerateList>;
}
