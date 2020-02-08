import { BaseGenerator, GenerateResult } from '../BaseGenerator';
import { RenderPageData } from '../../template/RenderData';

/**
 * 首页生成器
 */
export class HomeGenerator extends BaseGenerator {
  readonly type = 'home';

  async generate() {
    const result = new GenerateResult(this.type);

    result.renderList.push({
      path: '/index.html',
      renderType: 'tpl',
      mime: 'text/html',
      renderPageData: new RenderPageData({
        title: '首页',
        content: '',
        raw: '',
        updateDate: '',
        createDate: '',
      }),
    });

    return result;
  }
}
