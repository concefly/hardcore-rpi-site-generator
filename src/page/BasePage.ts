import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import * as _ from 'lodash';

export class BasePage {
  constructor(
    readonly raw: Buffer,
    readonly path: string,
    /** 相对 config.sourcePath 的路径 */
    readonly relativePath: string
  ) {}

  async getId() {
    return _.snakeCase(path.basename(this.path));
  }

  async getTitle() {
    return path.basename(this.path);
  }

  async getCreateDate() {
    const s = fs.statSync(this.path);
    return moment(s.ctime);
  }

  async getUpdateDate() {
    const s = fs.statSync(this.path);
    return moment(s.mtime);
  }

  async getCategories(): Promise<string[]> {
    return [];
  }

  async getTags(): Promise<string[]> {
    return [];
  }

  async getNoMetaRaw(): Promise<string> {
    return this.raw.toString('utf-8');
  }

  async render(): Promise<string> {
    return this.raw.toString('utf-8');
  }
}
