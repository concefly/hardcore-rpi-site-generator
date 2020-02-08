import { Collection } from '../collection';
import { BaseTemplateRender } from '../template/BaseTemplateRender';
import { RenderPageData } from '../template/RenderData';

/** generator 上报的信息, 用于声明合并 */
export interface IGenerateGlobalInfo {}

export class GenerateResult {
  /** 浅层合并所有 globalInfo */
  static mergeAndUpdateGlobalInfo(grList: GenerateResult[]) {
    const mergedGlobalInfo = grList.reduce(
      (re, gr) => ({ ...re, ...gr.globalInfo }),
      {} as GenerateResult['globalInfo']
    );

    grList.forEach(gr => {
      gr.globalInfo = mergedGlobalInfo;
    });
  }

  constructor(
    readonly type: string,
    /** generator 上报的信息 */
    public globalInfo: Partial<IGenerateGlobalInfo> = {},
    public renderList: (
      | {
          renderType: 'tpl';
          path: string;
          mime: string;
          renderPageData: RenderPageData;
        }
      | {
          renderType: 'raw';
          path: string;
          mime: string;
          buffer: Buffer;
        }
    )[] = []
  ) {}
}

export abstract class BaseGenerator {
  constructor(readonly collection: Collection, readonly templateRender: BaseTemplateRender) {}

  /** 生成器标识(相互不同，主要用于 html 渲染识别) */
  abstract readonly type: string;

  abstract async generate(): Promise<GenerateResult>;
}
