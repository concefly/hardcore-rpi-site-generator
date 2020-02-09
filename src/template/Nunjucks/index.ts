import { BaseTemplateRender } from '../BaseTemplateRender';
import * as nunjucks from 'nunjucks';
import * as glob from 'glob';

export class NunjucksRender extends BaseTemplateRender {
  private nunjucksEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(this.templatePath, {
      // dev 模式关掉 cache
      noCache: this.mode === 'dev',
    })
  );

  getDepFileInfos(): { path: string }[] {
    return glob.sync('**/*.nj', { cwd: this.templatePath, nodir: true, absolute: true }).map(p => {
      return {
        path: p,
      };
    });
  }

  async render(data: any, tplPath = 'index.nj', tplStr?: string) {
    const content = await new Promise<string>((resolve, reject) => {
      if (tplPath) {
        this.nunjucksEnv.render(tplPath, data, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      } else {
        this.nunjucksEnv.renderString(tplStr, data, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }
    });

    return { content };
  }
}
