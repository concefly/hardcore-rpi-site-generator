import { Collection } from '../../collection';
import * as _ from 'lodash';
import { BaseTextPage } from '../../page/BasePage';
import * as striptags from 'striptags';

export async function getPageList(collection: Collection) {
  const list = collection.getList();

  return Promise.all(
    _.chain(list)
      .filter(d => {
        // 跳过非文本类型
        if (!(d.page instanceof BaseTextPage)) return false;

        // 跳过非 markdown 文档
        const isMd = d.page.path.endsWith('.md');
        if (!isMd) return false;

        return true;
      })
      .sort((a, b) => {
        return b.page.getCreateDate().valueOf() - a.page.getCreateDate().valueOf();
      })
      .map(async (d: { page: BaseTextPage }) => {
        const id = d.page.getId();
        const title = d.page.getTitle();
        const raw = d.page.getNoMetaRaw();
        const meta = d.page.getMeta();
        const tags = d.page.getTags();
        const categories = d.page.getCategories();
        const createDate = d.page.getCreateDate().format('YYYY-MM-DD HH:mm:ss');
        const updateDate = d.page.getUpdateDate().format('YYYY-MM-DD HH:mm:ss');

        const content = await d.page.render();

        const isInPostsDir = d.page.relativePath.split('/').some(p => p === '_posts');

        const postPath = isInPostsDir
          ? `/post/${id}.html`
          : `/${d.page.relativePath}`.replace(/\/[^\/]*?$/, `/${id}.html`);

        const summary = _.truncate(striptags(content), { length: 100 });

        return {
          ...d,
          id,
          title,
          raw,
          meta,
          tags,
          categories,
          createDate,
          updateDate,
          isInPostsDir,
          postPath,
          content,
          summary,
        };
      })
      .value()
  );
}
