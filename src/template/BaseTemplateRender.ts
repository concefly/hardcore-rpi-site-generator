import { RenderData } from './RenderData';
import { ConfigMode } from '../config';

export class BaseTemplateRender {
  constructor(readonly templatePath: string, readonly mode: ConfigMode) {}

  getDepFileInfos(): { path: string }[] {
    return [];
  }

  async render(data: ReturnType<RenderData['toLocals']>): Promise<{ content: string }> {
    const content = JSON.stringify(data, null, 2);

    return { content };
  }
}
