import * as program from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';
import { SiteGenerator } from '../index';

program
  .option('-t, --templatePath [path]', 'templatePath')
  .option('-s, --sourcePath [path]', 'sourcePath')
  .option('-p, --pattern <glob>', 'pattern', '**/*.*')
  .option('-o, --out <path>', 'output dir', 'doc');

program.parse(process.argv);

async function run(opt: {
  templatePath: string;
  sourcePath: string;
  pattern: string;
  out: string;
}) {
  const sg = new SiteGenerator({
    sourcePath: opt.sourcePath,
    templatePath: opt.templatePath,
    pattern: opt.pattern,
  });

  const result = await sg.exec();

  for (const { data } of result) {
    const outFilePath = path.join(opt.out, data.url.replace(/^\//, ''));

    console.log('> emit %s', outFilePath);

    // 补全目录
    fs.mkdirpSync(path.dirname(outFilePath));

    fs.writeFileSync(outFilePath, data.content);
  }
}

run(_.pick(program as any, ['templatePath', 'sourcePath', 'pattern', 'out']));
