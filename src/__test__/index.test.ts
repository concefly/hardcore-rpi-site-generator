import test from 'ava';
import { SiteGenerator } from '..';
import * as _ from 'lodash';

const cwd = process.cwd();

test('SiteGenerator', async t => {
  const sg = new SiteGenerator({
    templatePath: `${cwd}/src/__test__/tpl`,
    sourcePath: `${cwd}/src/__test__/source`,
  });

  const result = await sg.exec();

  t.snapshot(_.sortBy(result.output.map(r => r.path)));

  t.snapshot(
    result.output.map(r => {
      return {
        ...r,
        content: r.mime.match(/^text/) ? r.content.toString('utf-8') : r.content,
      };
    })
  );
});
