import * as _ from 'lodash';
import { BaseGenerator } from '../generator/BaseGenerator';

export class RenderData {
  constructor(
    private readonly generator: BaseGenerator,
    private readonly data: {
      site: {};
      page: {
        title: string;
        content: string;
        raw: string;
      };
    }
  ) {}

  toLocals() {
    return _.cloneDeep({
      ctx: {
        type: this.generator.type,
        data: this.data,
      },
    });
  }
}
