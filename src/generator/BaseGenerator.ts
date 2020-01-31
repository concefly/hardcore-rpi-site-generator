import { Collection } from '../collection';
import { BaseTemplateRender } from '../template/BaseTemplateRender';

export abstract class BaseGenerator {
  constructor(readonly collection: Collection, readonly templateRender: BaseTemplateRender) {}

  /** 生成器标识(相互不同，主要用于 html 渲染识别) */
  abstract readonly type: string;

  abstract async generate(): Promise<{ path: string; content: string }[]>;
}
