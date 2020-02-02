import { BasePage } from '../page/BasePage';

export class Collection {
  private data = new Map<
    string,
    {
      page: BasePage;
    }
  >();

  set(page: BasePage) {
    this.data.set(page.path, { page });
    return this;
  }

  getList() {
    const list = [...this.data.values()];
    return list;
  }

  /** 依赖文件列表 */
  getDepFileInfos() {
    return this.getList().map(d => ({
      path: d.page.path,
      relativePath: d.page.relativePath,
      extInfo: d.page.extInfo,
    }));
  }
}
