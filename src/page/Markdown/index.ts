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

  isDraft() {
    return this.metaData.isDraft || super.isDraft();
  }

  getId() {
    return this.metaData.id || super.getId();
  }

  getTitle() {
    return this.metaData.title || super.getTitle();
  }

  getCreateDate() {
    return this.metaData.createDate || super.getCreateDate();
  }

  getUpdateDate() {
    return this.metaData.updateDate || this.metaData.createDate || super.getUpdateDate();
  }

  getCategories() {
    return this.metaData.categories || super.getCategories();
  }

  getTags() {
    return this.metaData.tags || super.getTags();
  }

  getMeta() {
    return this.metaData._originMeta;
  }

  getNoMetaRaw() {
    return this.mdStr;
  }

  /** 渲染 html */
  async render(): Promise<string> {
    let toParseMdStr = this.mdStr;

    // 如果有 templateRender， 就把 md 原文渲染一遍
    if (this.templateRender) {
      toParseMdStr = (
        await this.templateRender.render(
          {
            meta: this.metaData,
          },
          null,
          toParseMdStr
        )
      ).content;
    }

    return new Promise((resolve, reject) => {
      marked(toParseMdStr, { renderer: this.mdRerender }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
