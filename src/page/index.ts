import * as fs from 'fs';
import * as path from 'path';
import { Markdown } from './Markdown';
import { BasePage, BaseTextPage, BaseBinPage } from './BasePage';
import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';

export async function createPage(filePath: string, relPath: string): Promise<BasePage> {
  if (!fs.existsSync(filePath)) return null;

  const extname = path.extname(filePath);
  const raw = fs.readFileSync(filePath);

  // mime 类型表：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
  const mime = await new Promise<string>((resolve, reject) =>
    new Magic(filePath, MAGIC_MIME_TYPE).detect(raw, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  );

  // 文本类型
  if (mime.match(/^text/)) {
    // markdown
    if (extname === '.md') return new Markdown(raw, filePath, relPath, { mime });

    // 其他文本类型
    return new BaseTextPage(raw, filePath, relPath, { mime });
  } else {
    // 二进制类型
    return new BaseBinPage(raw, filePath, relPath, { mime });
  }
}
