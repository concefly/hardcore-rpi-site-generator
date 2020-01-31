export class BaseTemplateRender {
  constructor(readonly templatePath: string) {}

  async render(data: any): Promise<{ content: string }> {
    const content = JSON.stringify(data, null, 2);

    return { content };
  }
}
