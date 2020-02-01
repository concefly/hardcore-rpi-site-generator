import test from 'ava';
import { PostGenerator } from '..';
import { Collection } from '../../../collection';
import { Markdown } from '../../../page/Markdown';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';

test('PostGenerator', async t => {
  const collection = new Collection().set(
    new Markdown(Buffer.from('a', 'utf-8'), '/_posts/a.md', '_posts/a.md')
  );
  const templateRender = new BaseTemplateRender('/');
  const generator = new PostGenerator(collection, templateRender);

  const result = await generator.generate();

  t.snapshot(result.map(r => ({ ...r.data, content: r.data.content.toString('utf-8') })));
});
