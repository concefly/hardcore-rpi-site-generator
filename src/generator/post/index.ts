import { BaseGenerator } from '../BaseGenerator';
import { RenderData } from '../../template/RenderData';

export class PostGenerator extends BaseGenerator {
  async generate() {
    const list = this.collection.getList();
    const result: { path: string; content: string }[] = [];

    for (const { page } of list) {
      const createDate = await page.getCreateDate();

      const renderData = new RenderData({
        site: {},
        page: {
          title: await page.getTitle(),
          content: await page.render(),
        },
      });

      const { content } = await this.templateRender.render(renderData);

      result.push({
        path: `post/${createDate.valueOf()}.html`,
        content,
      });
    }

    return result;
  }
}
