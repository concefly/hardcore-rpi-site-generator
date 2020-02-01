import { BaseGenerator, GenerateResult } from '../BaseGenerator';

/**
 * 静态文件生成器
 *
 * - 不以 `_` 开头
 */
export class StaticGenerator extends BaseGenerator {
  readonly type = 'media';

  async generate() {
    const list = this.collection.getList();
    const result = new GenerateResult(this.type);

    for (const { page } of list) {
      // 有路径段是以 _ 开头的，则跳过
      if (page.relativePath.split('/').some(p => p.startsWith('_'))) continue;

      const url = page.relativePath.startsWith('/') ? page.relativePath : '/' + page.relativePath;

      result.renderList.push({
        path: url,
        renderType: 'raw',
        buffer: page.raw,
        mime: page.extInfo.mime,
      });
    }

    return result;
  }
}
