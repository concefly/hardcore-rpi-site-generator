import * as marked from 'marked';
import { MdRenderer } from './MdRenderer';
import { splitMetaStr, IMdMeta, getMetaFromRaw } from './util';

import * as _ from 'lodash';
import { BasePage } from '../BasePage';

export class Markdown extends BasePage {
  private mdRerender = new MdRenderer();
  private metaStr = '';
  private mdStr = '';

  private metaData: IMdMeta;

  constructor(readonly raw: string, readonly path: string) {
    super(raw, path);

    [this.metaStr, this.mdStr] = splitMetaStr(raw);
    this.metaData = getMetaFromRaw(this.metaStr);
  }

  async getId() {
    return this.metaData.id || super.getId();
  }

  async getTitle() {
    return this.metaData.title || super.getTitle();
  }

  async getCreateDate() {
    return this.metaData.createDate || super.getCreateDate();
  }

  async getUpdateDate() {
    return this.metaData.updateDate || super.getUpdateDate();
  }

  async getCategories() {
    return this.metaData.categories || super.getCategories();
  }

  async getTags() {
    return this.metaData.tags || super.getTags();
  }

  /** 渲染 html */
  async render(): Promise<string> {
    return new Promise((resolve, reject) => {
      marked(this.mdStr, { renderer: this.mdRerender }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
