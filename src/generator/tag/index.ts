import {
  BaseGenerator,
  GenerateList,
  GenerateGlobalInfo,
  IRenderListTplItem,
} from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';
import * as _ from 'lodash';

/**
 * tag 页面生成器
 */
export class TagGenerator extends BaseGenerator {
  readonly type = 'tag';

  async getGlobalInfo() {
    return new GenerateGlobalInfo({});
  }

  async generateList(globalInfo: GenerateGlobalInfo) {
    const renderList = _.chain(globalInfo.data.post.tags)
      .map<IRenderListTplItem>((pathList, tagName) => {
        const postSummaryList = pathList.map(p => ({ ...globalInfo.data.post.map[p], path: p }));

        return {
          path: `/tag/${tagName.replace(/\s+/g, '-')}.html`,
          renderType: 'tpl',
          mime: 'text/html',
          renderPageData: new RenderPageData({
            title: tagName,
            content: '',
            updateDate: '',
            createDate: '',
            meta: postSummaryList,
          }),
        };
      })
      .value();

    return new GenerateList(this.type, renderList);
  }
}
