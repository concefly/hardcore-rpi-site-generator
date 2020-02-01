import test from 'ava';
import { Markdown } from '..';

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
`;

test('normal', async t => {
  const md = new Markdown(Buffer.from(content, 'utf-8'), '/', '/');

  t.deepEqual(await md.getTitle(), '1');
  t.deepEqual((await md.getCreateDate()).format('YYYY-MM-DD'), '2020-01-30');
  t.deepEqual((await md.getUpdateDate()).format('YYYY-MM-DD'), '2020-01-31');
  t.deepEqual(await md.getTags(), ['a']);
  t.deepEqual(await md.getCategories(), ['a', 'b']);

  const html = await md.render();
  t.snapshot(html);
});
