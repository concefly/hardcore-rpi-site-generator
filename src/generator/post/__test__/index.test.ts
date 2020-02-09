import test from 'ava';
import { PostGenerator } from '..';
import { Collection } from '../../../collection';
import { Markdown } from '../../../page/Markdown';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';

test('PostGenerator:/_posts/a.md', async t => {
  const collection = new Collection().set(
    new Markdown(Buffer.from('a', 'utf-8'), '/_posts/a.md', '_posts/a.md', { mime: 'text/plain' })
  );
  const templateRender = new BaseTemplateRender('/', 'dev');
  const generator = new PostGenerator(collection, templateRender);

  const result = await generator.generate();

  t.snapshot(result);
});

test('PostGenerator:/about', async t => {
  const collection = new Collection().set(
    new Markdown(Buffer.from('a', 'utf-8'), '/about.md', 'about.md', { mime: 'text/plain' })
  );
  const templateRender = new BaseTemplateRender('/', 'dev');
  const generator = new PostGenerator(collection, templateRender);

  const result = await generator.generate();

  t.snapshot(result);
});


test('PostGenerator:/xxx/about', async t => {
  const collection = new Collection().set(
    new Markdown(Buffer.from('a', 'utf-8'), '/xxx/about.md', 'xxx/about.md', { mime: 'text/plain' })
  );
  const templateRender = new BaseTemplateRender('/', 'dev');
  const generator = new PostGenerator(collection, templateRender);

  const result = await generator.generate();

  t.snapshot(result);
});