import test from 'ava';
import { SiteGenerator } from '..';

const cwd = process.cwd();

test('SiteGenerator', async t => {
  const sg = new SiteGenerator({
    templatePath: `${cwd}/src/__test__/tpl`,
    sourcePath: `${cwd}/src/__test__/source`,
    pattern: '**/*.md',
  });

  const result = await sg.exec();
  t.snapshot(result);
});
