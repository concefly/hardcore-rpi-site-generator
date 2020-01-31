import { BaseTemplateRender } from '../BaseTemplateRender';
import * as nunjucks from 'nunjucks';

export class NunjucksRender extends BaseTemplateRender {
  private nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(this.templatePath));

  async render(data: any) {
    const content = await new Promise<string>((resolve, reject) => {
      this.nunjucksEnv.render('index.html', data, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return { content };
  }
}
