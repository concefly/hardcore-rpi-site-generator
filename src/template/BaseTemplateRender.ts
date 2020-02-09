import { ConfigMode } from '../config';
import * as fs from 'fs';
import * as path from 'path';

export class BaseTemplateRender {
  constructor(readonly templatePath: string, readonly mode: ConfigMode) {}

  getDepFileInfos(): { path: string }[] {
    return [];
  }

  isTplExist(tplPath: string) {
    return fs.existsSync(path.join(this.templatePath, tplPath));
  }

  async render(data: any, _tplPath?: string, _tplStr?: string): Promise<{ content: string }> {
    const content = JSON.stringify(data, null, 2);

    return { content };
  }
}
