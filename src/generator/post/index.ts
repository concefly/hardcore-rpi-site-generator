import { BaseGenerator, GenerateResult } from '../BaseGenerator';
import * as _ from 'lodash';
import { getPageList } from './util';
import { RenderPageData } from '../../template/RenderData';

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
    const list = await getPageList(this.collection);
    const result = new GenerateResult(this.type);

    const postList = list.filter(d => d.isInPostsDir);

    result.globalInfo = {
      post: {
        list: postList.map(d => d.postPath),
        tags: postList.reduce(
          (tagMap, d) => {
            const re = { ...tagMap };

            d.tags.forEach(tag => {
              if (!re[tag]) re[tag] = [];

              re[tag].push(d.postPath);
            });

            return re;
          },
          {} as {
            [name: string]: string[];
          }
        ),
        map: _.mapValues(_.keyBy(list, 'postPath'), d => {
          return {
            title: d.title,
            createDate: d.createDate,
            updateDate: d.updateDate,
            tags: d.tags,
            categories: d.categories,
            originMeta: d.meta,
            summary: d.summary,
          };
        }),
      },
    };

    result.renderList = list.map(d => {
      return {
        renderType: 'tpl',
        path: d.postPath,
        mime: 'text/plain',
        renderPageData: new RenderPageData({
          title: d.title,
          content: d.content,
          createDate: d.createDate,
          updateDate: d.updateDate,
          meta: d.meta,
        }),
      };
    });

    return result;
  }
}
