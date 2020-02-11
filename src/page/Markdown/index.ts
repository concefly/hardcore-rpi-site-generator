import * as marked from 'marked';
import { MdRenderer } from './MdRenderer';
import { splitMetaStr, IMdMeta, getMetaFromRaw } from './util';
import * as _ from 'lodash';
import { BaseTextPage } from '../BasePage';

export class Markdown extends BaseTextPage {
  private mdRerender = new MdRenderer();
  private mdSplitData = splitMetaStr(this.raw.toString('utf-8'));

  /** 用户定义的 meta */
  private userDefMetaData: IMdMeta = getMetaFromRaw(this.metaStr);

  private metaData: IMdMeta = {
    isDraft: this.userDefMetaData.isDraft,
    id: this.userDefMetaData.id || super.getId(),
    title: this.userDefMetaData.title || super.getTitle(),
    createDate: this.userDefMetaData.createDate || super.getCreateDate(),
    updateDate:
      this.userDefMetaData.updateDate || this.userDefMetaData.createDate || super.getUpdateDate(),
    categories: this.userDefMetaData.categories,
    tags: this.userDefMetaData.tags,
    _originMeta: this.userDefMetaData._originMeta,
  };

  get metaStr() {
    return this.mdSplitData[0];
  }

  get mdStr() {
    return this.mdSplitData[1];
  }

  isDraft() {
    return this.metaData.isDraft;
  }

  getId() {
    return this.metaData.id;
  }

  getTitle() {
    return this.metaData.title;
  }

  getCreateDate() {
    return this.metaData.createDate;
  }

  getUpdateDate() {
    return this.metaData.updateDate;
  }

  getCategories() {
    return this.metaData.categories;
  }

  getTags() {
    return this.metaData.tags;
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
