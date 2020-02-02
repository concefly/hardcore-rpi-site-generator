import { BaseTemplateRender } from './template/BaseTemplateRender';
import { NunjucksRender } from './template/Nunjucks';

export type ConfigMode = 'dev' | 'prod';

export class Config {
  constructor(
    readonly data: {
      sourcePath: string;
      templatePath: string;
      pattern?: string;
      TemplateRender?: typeof BaseTemplateRender;
      mode?: ConfigMode;
    }
  ) {
    Object.assign(
      this.data,
      // 默认配置
      {
        pattern: '**',
        TemplateRender: NunjucksRender,
        mode: 'prod',
      } as Partial<Config['data']>,
      this.data
    );
  }
}
