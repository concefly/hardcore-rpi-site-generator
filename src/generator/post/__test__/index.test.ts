import test from 'ava';
import { PostGenerator } from '..';
import { Collection } from '../../../collection';
import { Markdown } from '../../../page/Markdown';
import { BaseTemplateRender } from '../../../template/BaseTemplateRender';

test('PostGenerator', async t => {
  const collection = new Collection().set(new Markdown('a', '/a.md'));
  const templateRender = new BaseTemplateRender('/');
  const generator = new PostGenerator(collection, templateRender);

  const result = await generator.generate();

  t.snapshot(result);
});
