export class RenderData {
  constructor(
    readonly data: {
      site: {};
      page: {
        title: string;
        content: string;
      };
    }
  ) {}
}
