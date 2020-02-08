import { BaseGenerator, GenerateResult, IGenerateGlobalInfo } from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';
import { BaseTextPage } from '../../page/BasePage';
import * as _ from 'lodash';

interface IPageSummaryItem {
  title: string;
  path: string;
}

declare module '../BaseGenerator' {
  interface IGenerateGlobalInfo {
    post?: {
      list: IPageSummaryItem[];
      count: number;
      tags: {
        [name: string]: IPageSummaryItem[];
      };
    };
  }
}

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
    const sortedList = [...list].sort(
      (a, b) => b.page.getCreateDate().valueOf() - a.page.getCreateDate().valueOf()
    );

    const result = new GenerateResult(this.type);

    const resultRenderList: {
      renderType: 'tpl';
      path: string;
      mime: string;
      renderPageData: RenderPageData;
    }[] = [];

    const resultTags: IGenerateGlobalInfo['post']['tags'] = {};

    for (const { page } of sortedList) {
      if (!(page instanceof BaseTextPage)) continue;

      // 模拟 hexo 规则, 不在 _posts 目录下的直接跳过
      if (!page.relativePath.includes('_posts')) continue;

      const id = page.getId();
      const title = page.getTitle();
      const raw = page.getNoMetaRaw();
      const meta = page.getMeta();
      const tags = page.getTags();

      const content = await page.render();

      const renderPageData = new RenderPageData({
        title,
        content,
        raw,
        meta,
        createDate: page.getCreateDate().format('YYYY-MM-DD HH:mm:ss'),
        updateDate: page.getUpdateDate().format('YYYY-MM-DD HH:mm:ss'),
      });

      const postPath = `/post/${id}.html`;

      resultRenderList.push({
        path: postPath,
        renderType: 'tpl',
        renderPageData,
        mime: page.extInfo.mime,
      });

      // 填充 tag
      tags.forEach(tag => {
        if (!resultTags[tag]) resultTags[tag] = [];
        resultTags[tag].push({ title, path: postPath });
      });
    }

    // d
    resultRenderList;

    result.renderList = resultRenderList;

    // 填充 globalInfo
    result.globalInfo.post = {
      list: resultRenderList.map(r => ({ path: r.path, title: r.renderPageData.data.title })),
      count: result.renderList.length,
      tags: resultTags,
    };

    return result;
  }
}
