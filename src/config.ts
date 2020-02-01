import { BaseTemplateRender } from './template/BaseTemplateRender';
import { NunjucksRender } from './template/Nunjucks';

export class Config {
  constructor(
    readonly data: {
      sourcePath: string;
      templatePath: string;
      pattern?: string;
      TemplateRender?: typeof BaseTemplateRender;
    }
  ) {
    Object.assign(
      this.data,
      // 默认配置
      {
        pattern: '**',
        TemplateRender: NunjucksRender,
      } as Partial<Config['data']>,
      this.data
    );
  }
}
