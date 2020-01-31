import { BaseGenerator } from '../BaseGenerator';
import { RenderData } from '../../template/RenderData';

export class PostGenerator extends BaseGenerator {
  readonly type = 'post';

  async generate() {
    const list = this.collection.getList();
    const result: { path: string; content: string }[] = [];

    for (const { page } of list) {
      const renderData = new RenderData(this, {
        site: {},
        page: {
          title: await page.getTitle(),
          content: await page.render(),
        },
      });

      const { content } = await this.templateRender.render(renderData.toLocals());

      result.push({
        path: `post/${await page.getId()}.html`,
        content,
      });
    }

    return result;
  }
}
