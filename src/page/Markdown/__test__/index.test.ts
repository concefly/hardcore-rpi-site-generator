import test from 'ava';
import { Markdown } from '..';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';

class MockTemplateRender extends BaseTemplateRender {
  isTplExist() {
    return true;
  }

  async render(data: any, _tplPath?: string, tplStr?: string): Promise<{ content: string }> {
    const content = tplStr.replace(
      /__RENDER_TAG__/g,
      '<pre>\n' + JSON.stringify(data, null, 2) + '\n<pre>'
    );

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
isDraft: true
---

# h1
## h2

__RENDER_TAG__
`;

test('normal', async t => {
  const md = new Markdown(Buffer.from(content, 'utf-8'), '/', '/', { mime: 'text/plain' });

  md.setTemplateRender(new MockTemplateRender('fake', 'dev'));

  t.deepEqual(md.getTitle(), '1');
  t.deepEqual(md.getCreateDate().format('YYYY-MM-DD'), '2020-01-30');
  t.deepEqual(md.getUpdateDate().format('YYYY-MM-DD'), '2020-01-31');
  t.deepEqual(md.getTags(), ['a']);
  t.deepEqual(md.getCategories(), ['a', 'b']);
  t.deepEqual(md.isDraft(), true);

  const html = await md.render();
  t.snapshot(html);
});
