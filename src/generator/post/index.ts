import { BaseGenerator, GenerateResultItem } from '../BaseGenerator';
import { RenderData } from '../../template/RenderData';

export class PostGenerator extends BaseGenerator {
  readonly type = 'post';

  async generate() {
    const list = this.collection.getList();
    const result: GenerateResultItem[] = [];

    for (const { page } of list) {
      // 模拟 hexo 规则, 不在 _posts 目录下的直接跳过
      if (!page.relativePath.includes('_posts')) continue;

      const [id, title, content, raw] = await Promise.all([
        page.getId(),
        page.getTitle(),
        page.render(),
        page.getNoMetaRaw(),
      ]);

      const renderData = new RenderData(this, {
        site: {},
        page: {
          title,
          content,
          raw,
        },
      });

      const { content: renderContent } = await this.templateRender.render(renderData.toLocals());

      result.push(
        new GenerateResultItem({
          url: `/post/${id}.html`,
          content: Buffer.from(renderContent, 'utf-8'),
        })
      );
    }

    return result;
  }
}
