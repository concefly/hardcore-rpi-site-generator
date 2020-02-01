import { BaseGenerator, GenerateResultItem } from '../BaseGenerator';

export class StaticGenerator extends BaseGenerator {
  readonly type = 'static';

  async generate() {
    const list = this.collection.getList();
    const result: GenerateResultItem[] = [];

    for (const { page } of list) {
      // 有路径段是以 _ 开头的，则跳过
      if (page.relativePath.split('/').some(p => p.startsWith('_'))) continue;

      const url = page.relativePath.startsWith('/') ? page.relativePath : '/' + page.relativePath;

      result.push(new GenerateResultItem({ url, content: page.raw }));
    }

    return result;
  }
}
