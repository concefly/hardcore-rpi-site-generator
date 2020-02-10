import test from 'ava';
import { TagGenerator } from '..';
import { Collection } from '../../../collection';
import { Markdown } from '../../../page/Markdown';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';
import { PostGenerator } from '../../post';
import * as _ from 'lodash';
import { invokeAllGenerator } from '../..';

test('TagGenerator', async t => {
  const collection = new Collection()
    .set(
      new Markdown(
        Buffer.from(
          `
---
tags: [t1]
---
      `,
          'utf-8'
        ),
        '/_posts/a.md',
        '_posts/a.md',
        { mime: 'text/plain' }
      )
    )
    .set(
      new Markdown(
        Buffer.from(
          `
---
tags: [t          2      ]
---
          `,
          'utf-8'
        ),
        '/_posts/b.md',
        '_posts/b.md',
        { mime: 'text/plain' }
      )
    );

  const templateRender = new BaseTemplateRender('/', 'dev');
  const generators = [PostGenerator, TagGenerator].map(G => new G(collection, templateRender));

  // 合并结果集
  const result = await invokeAllGenerator(generators);

  t.snapshot(result.list[1].renderList.map(d => d.path));
});
