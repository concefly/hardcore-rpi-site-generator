import * as glob from 'glob';
import * as path from 'path';
import { createPage } from './page';
import { Collection } from './collection';
import { PostGenerator } from './generator/post';
import { BaseTemplateRender } from './template/BaseTemplateRender';
import { GenerateResultItem } from './generator/BaseGenerator';
import { Config } from './config';
import { StaticGenerator } from './generator/static';

export class SiteGenerator {
  private config: Config;
  private templateRender: BaseTemplateRender;

  constructor(configData: Config['data']) {
    this.config = new Config(configData);
    this.templateRender = new this.config.data.TemplateRender(this.config.data.templatePath);
  }

  private getPages() {
    const filePathList = glob.sync(this.config.data.pattern, {
      cwd: this.config.data.sourcePath,
      nodir: true,
      absolute: true,
    });

    return filePathList
      .map(p => createPage(p, path.relative(this.config.data.sourcePath, p)))
      .filter(v => v);
  }

  private getCollection() {
    const collection = new Collection();
    const pages = this.getPages();

    pages.forEach(p => collection.set(p));

    return collection;
  }

  async exec() {
    const collection = this.getCollection();
    const generators = [PostGenerator, StaticGenerator].map(
      G => new G(collection, this.templateRender)
    );

    let result: GenerateResultItem[] = [];

    for (const generator of generators) {
      result = result.concat(...(await generator.generate()));
    }

    return result;
  }
}
