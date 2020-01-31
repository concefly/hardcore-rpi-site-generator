import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { createPage } from './page';
import { Collection } from './collection';
import { PostGenerator } from './generator/post';
import { BaseTemplateRender } from './template/BaseTemplateRender';
import { NunjucksRender } from './template/Nunjucks';

/** 默认配置 */
export const defaultConfig: Partial<SiteGenerator['config']> = {
  TemplateRender: NunjucksRender,
};

export class SiteGenerator {
  private templateRender: BaseTemplateRender;

  constructor(
    readonly config: {
      sourcePath: string;
      pattern: string;
      templatePath: string;
      TemplateRender?: typeof BaseTemplateRender;
    }
  ) {
    Object.assign(this.config, defaultConfig, this.config);

    this.templateRender = new this.config.TemplateRender(this.config.templatePath);
  }

  private getPages() {
    const filePathList = glob
      .sync(this.config.pattern, { cwd: this.config.sourcePath })
      .map(p => path.join(this.config.sourcePath, p));

    return filePathList.map(p => createPage(p)).filter(v => v);
  }

  private getCollection() {
    const collection = new Collection();
    const pages = this.getPages();

    pages.forEach(p => collection.set(p));

    return collection;
  }

  async exec() {
    const collection = this.getCollection();
    const generators = [PostGenerator].map(G => new G(collection, this.templateRender));

    let result: {
      path: string;
      content: string;
    }[] = [];

    for (const generator of generators) {
      result = result.concat(...(await generator.generate()));
    }

    return result;
  }
}
