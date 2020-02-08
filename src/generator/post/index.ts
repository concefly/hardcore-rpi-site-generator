import { BaseGenerator, GenerateResult } from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';
import { BaseTextPage } from '../../page/BasePage';

/**
 * 文章生成器
 *
 * - 位于 _posts 目录下
 * - 文本文件
 */
export class PostGenerator extends BaseGenerator {
  readonly type = 'post';

  async generate() {
    const list = this.collection.getList();
    const result = new GenerateResult(this.type);

    for (const { page } of list) {
      if (!(page instanceof BaseTextPage)) continue;

      // 模拟 hexo 规则, 不在 _posts 目录下的直接跳过
      if (!page.relativePath.includes('_posts')) continue;

      const [id, title, content, raw, meta] = await Promise.all([
        page.getId(),
        page.getTitle(),
        page.render(),
        page.getNoMetaRaw(),
        page.getMeta(),
      ]);

      const renderPageData = new RenderPageData({
        title,
        content,
        raw,
        meta,
      });

      result.renderList.push({
        path: `/post/${id}.html`,
        renderType: 'tpl',
        renderPageData,
        mime: page.extInfo.mime,
      });
    }

    // 填充 globalInfo
    result.globalInfo.post = {
      list: result.renderList.map(
        r => r.renderType === 'tpl' && { path: r.path, title: r.renderPageData.data.title }
      ),
      count: result.renderList.length,
    };

    return result;
  }
}
