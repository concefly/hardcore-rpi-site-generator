import { BaseGenerator, GenerateList, GenerateGlobalInfo } from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';

/**
 * 首页生成器
 */
export class HomeGenerator extends BaseGenerator {
  readonly type = 'home';

  async getGlobalInfo() {
    return new GenerateGlobalInfo({});
  }

  async generateList() {
    const result = new GenerateList(this.type);

    result.renderList.push({
      path: '/index.html',
      renderType: 'tpl',
      mime: 'text/html',
      renderPageData: new RenderPageData({
        title: '首页',
        content: '',
        updateDate: '',
        createDate: '',
      }),
    });

    return result;
  }
}
