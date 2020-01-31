import { Collection } from '../collection';
import { BaseTemplateRender } from '../template/BaseTemplateRender';

export abstract class BaseGenerator {
  constructor(readonly collection: Collection, readonly templateRender: BaseTemplateRender) {}

  abstract async generate(): Promise<{ path: string; content: string }[]>;
}
