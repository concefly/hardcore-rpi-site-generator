import * as marked from 'marked';
import { MdRenderer } from './MdRenderer';
import { splitMetaStr, IMdMeta, getMetaFromRaw } from './util';
import * as _ from 'lodash';
import { BaseTextPage } from '../BasePage';

export class Markdown extends BaseTextPage {
  private mdRerender = new MdRenderer();
  private mdSplitData = splitMetaStr(this.raw.toString('utf-8'));
  private metaData: IMdMeta = getMetaFromRaw(this.metaStr);

  get metaStr() {
    return this.mdSplitData[0];
  }

  get mdStr() {
    return this.mdSplitData[1];
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

  async getNoMetaRaw() {
    return this.mdStr;
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
