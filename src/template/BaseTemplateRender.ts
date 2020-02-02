import { RenderData } from './RenderData';

export class BaseTemplateRender {
  constructor(readonly templatePath: string) {}

  getDepFileInfos(): { path: string }[] {
    return [];
  }

  async render(data: ReturnType<RenderData['toLocals']>): Promise<{ content: string }> {
    const content = JSON.stringify(data, null, 2);

    return { content };
  }
}
