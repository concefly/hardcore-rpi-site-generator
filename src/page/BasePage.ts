import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BaseTemplateRender } from '../template/BaseTemplateRender';

export class BasePage {
  constructor(
    readonly raw: Buffer,
    readonly path: string,
    /** 相对 config.sourcePath 的路径 */
    readonly relativePath: string,
    readonly extInfo: {
      mime: string;
    }
  ) {}

  getId() {
    return _.snakeCase(path.basename(this.path).split('.')[0]);
  }

  getTitle() {
    return path.basename(this.path);
  }

  getCreateDate() {
    // utc false 是为了不同环境 ci 结果一致
    if (!fs.existsSync(this.path)) return moment(0).utc(false);

    const s = fs.statSync(this.path);
    return moment(s.ctime);
  }

  getUpdateDate() {
    if (!fs.existsSync(this.path)) return moment(0).utc(false);

    const s = fs.statSync(this.path);
    return moment(s.mtime);
  }
}

/** 文本类型 */
export class BaseTextPage extends BasePage {
  templateRender?: BaseTemplateRender;

  setTemplateRender(render: BaseTemplateRender) {
    this.templateRender = render;
    return this;
  }

  isDraft(): boolean {
    return false;
  }

  getCategories(): string[] {
    return [];
  }

  getTags(): string[] {
    return [];
  }

  getMeta(): any {
    return null;
  }

  getNoMetaRaw(): string {
    return this.raw.toString('utf-8');
  }

  async render(): Promise<string> {
    return this.raw.toString('utf-8');
  }
}

/** 二进制类型 */
export class BaseBinPage extends BasePage {}
