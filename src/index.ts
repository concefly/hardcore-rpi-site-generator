import * as glob from 'glob';
import * as path from 'path';
import { createPage } from './page';
import { Collection } from './collection';
import { PostGenerator } from './generator/post';
import { BaseTemplateRender } from './template/BaseTemplateRender';
import { GenerateList } from './generator/BaseGenerator';
import { Config } from './config';
import { StaticGenerator } from './generator/static';
import { RenderData } from './template/RenderData';
import { HomeGenerator } from './generator/home';
import * as _ from 'lodash';
import { invokeAllGenerator } from './generator';
import { TagGenerator } from './generator/tag';

export * from './config';

export type IRenderLocals = ReturnType<RenderData['toLocals']>;

export interface IExecResultItem {
  path: string;
  content: Buffer;
  renderType: GenerateList['renderList'][0]['renderType'];
  mime: string;
}

/** 执行结果 */
export interface IExecResult {
  depTplInfos: ReturnType<BaseTemplateRender['getDepFileInfos']>;
  depFileInfos: ReturnType<Collection['getDepFileInfos']>;
  output: IExecResultItem[];
}

export class SiteGenerator {
  private config: Config;
  private templateRender: BaseTemplateRender;
  private readonly generatorList = [PostGenerator, StaticGenerator, HomeGenerator, TagGenerator];

  constructor(configData: Config['data']) {
    this.config = new Config(configData);
    this.templateRender = new this.config.data.TemplateRender(
      this.config.data.templatePath,
      this.config.data.mode
    );
  }

  private async getPages() {
    const filePathList = glob.sync(this.config.data.pattern, {
      cwd: this.config.data.sourcePath,
      nodir: true,
      absolute: true,
    });

    const result = await Promise.all(
      filePathList.map(p =>
        createPage(p, path.relative(this.config.data.sourcePath, p), this.templateRender)
      )
    );

    return result.filter(v => v);
  }

  private async getCollection() {
    const collection = new Collection();
    const pages = await this.getPages();

    pages.forEach(p => collection.set(p));

    return collection;
  }

  async exec(opt?: { extraRenderLocals?: any }): Promise<IExecResult> {
    const collection = await this.getCollection();
    const generators = this.generatorList.map(G => new G(collection, this.templateRender));

    const generateResult = await invokeAllGenerator(generators, opt?.extraRenderLocals);

    const result: IExecResult = {
      depTplInfos: this.templateRender.getDepFileInfos(),
      depFileInfos: collection.getDepFileInfos(),
      output: [],
    };

    for (const gr of generateResult.list) {
      for (const renderInfo of gr.renderList) {
        const resultItem: IExecResultItem = {
          path: renderInfo.path,
          renderType: renderInfo.renderType,
          mime: renderInfo.mime,
          content: null,
        };

        switch (renderInfo.renderType) {
          case 'raw':
            resultItem.content = renderInfo.buffer;
            break;
          case 'tpl': {
            const locals = new RenderData(
              gr.type,
              generateResult.globalInfo,
              renderInfo.renderPageData
            ).toLocals();

            const { content } = await this.templateRender.render({
              ...opt?.extraRenderLocals,
              ...locals,
            });

            resultItem.content = Buffer.from(content, 'utf-8');
            break;
          }
          default:
            break;
        }

        if (!resultItem.content) continue;

        result.output.push(resultItem);
      }
    }

    return result;
  }
}
