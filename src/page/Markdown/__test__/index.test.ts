import test from 'ava';
import { Markdown } from '..';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';

class MockTemplateRender extends BaseTemplateRender {
  isTplExist() {
    return true;
  }

  async render(data: any, _tplPath?: string, tplStr?: string): Promise<{ content: string }> {
    const content = tplStr.replace(/__RENDER_TAG__/g, JSON.stringify(data, null, 2));

    return { content };
  }
}

const content = `
---
title: 1
createDate: 2020-01-30
updateDate: 2020-01-31
tags: a
categories:
  - a
  - b
---

# h1
## h2

__RENDER_TAG__
`;

test('normal', async t => {
  const md = new Markdown(Buffer.from(content, 'utf-8'), '/', '/', { mime: 'text/plain' });

  md.setTemplateRender(new MockTemplateRender('fake', 'dev'));

  t.deepEqual(await md.getTitle(), '1');
  t.deepEqual((await md.getCreateDate()).format('YYYY-MM-DD'), '2020-01-30');
  t.deepEqual((await md.getUpdateDate()).format('YYYY-MM-DD'), '2020-01-31');
  t.deepEqual(await md.getTags(), ['a']);
  t.deepEqual(await md.getCategories(), ['a', 'b']);

  const html = await md.render();
  t.snapshot(html);
});
