import { BaseGenerator, GenerateResult, IGenerateGlobalInfo } from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';
import { BaseTextPage } from '../../page/BasePage';
import * as _ from 'lodash';
import * as striptags from 'striptags';

interface IPageSummaryItem {
  title: string;
  createDate: string;
  updateDate: string;
  tags: string[];
  categories: string[];
  summary: string;
  originMeta: any;
}

declare module '../BaseGenerator' {
  interface IGenerateGlobalInfo {
    post?: {
      map: {
        [path: string]: IPageSummaryItem;
      };
      list: string[];
      count: number;
      tags: {
        [name: string]: string[];
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

    const resultMap: IGenerateGlobalInfo['post']['map'] = {};
    const resultTags: IGenerateGlobalInfo['post']['tags'] = {};

    for (const { page } of sortedList) {
      // 跳过非文本类型
      if (!(page instanceof BaseTextPage)) continue;

      // 跳过非 markdown 文档
      const isMd = !!page.path.match(/\.md$/);
      if (!isMd) continue;

      const id = page.getId();
      const title = page.getTitle();
      const raw = page.getNoMetaRaw();
      const meta = page.getMeta();
      const tags = page.getTags();
      const categories = page.getCategories();
      const createDate = page.getCreateDate().format('YYYY-MM-DD HH:mm:ss');
      const updateDate = page.getUpdateDate().format('YYYY-MM-DD HH:mm:ss');

      const content = await page.render();

      const renderPageData = new RenderPageData({
        title,
        content,
        raw,
        meta,
        createDate,
        updateDate,
      });

      const isInPostsDir = page.relativePath.split('/').some(p => p === '_posts');

      const postPath = isInPostsDir
        ? `/post/${id}.html`
        : `/${page.relativePath}`.replace(/\/[^\/]*?$/, `/${id}.html`);

      resultRenderList.push({
        path: postPath,
        renderType: 'tpl',
        renderPageData,
        mime: page.extInfo.mime,
      });

      // 填充 tag
      tags.forEach(tag => {
        if (!resultTags[tag]) resultTags[tag] = [];
        resultTags[tag].push(postPath);
      });

      resultMap[postPath] = {
        title,
        updateDate,
        createDate,
        tags,
        categories,
        summary: _.chain(content)
          .thru(s => striptags(s))
          .truncate({ length: 100 })
          .value(),
        originMeta: meta,
      };
    }

    result.renderList = resultRenderList;

    // 填充 globalInfo
    result.globalInfo.post = {
      map: resultMap,
      list: resultRenderList.map(r => r.path),
      count: result.renderList.length,
      tags: resultTags,
    };

    return result;
  }
}
