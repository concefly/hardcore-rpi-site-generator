import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

export class BasePage {
  constructor(readonly raw: string, readonly path: string) {}

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

  async render(): Promise<string> {
    return this.raw;
  }
}
