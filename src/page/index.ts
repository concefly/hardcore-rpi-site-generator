import * as fs from 'fs';
import * as path from 'path';
import { Markdown } from './Markdown';
import { BasePage, BaseTextPage, BaseBinPage } from './BasePage';
import { BaseTemplateRender } from '../template/BaseTemplateRender';
import * as mimeTypes from 'mime-types';

// mime 类型表：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
async function getFileType(
  filePath?: string
): Promise<{
  mime: string;
  ext: string;
}> {
  const ext = path.extname(filePath);
  const mime = mimeTypes.lookup(filePath);

  if (mime) return { mime, ext };

  // 识别不到 mime 就认为是二进制
  return { ext, mime: 'application/octet-stream' };
}

export async function createPage(
  filePath: string,
  relPath: string,
  templateRender: BaseTemplateRender
): Promise<BasePage> {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath);
  const { mime, ext } = await getFileType(filePath);

  // 文本类型
  if (mime.match(/^text/)) {
    // markdown
    if (ext === '.md') {
      return new Markdown(raw, filePath, relPath, { mime }).setTemplateRender(templateRender);
    }

    // 其他文本类型
    return new BaseTextPage(raw, filePath, relPath, { mime }).setTemplateRender(templateRender);
  } else {
    // 二进制类型
    return new BaseBinPage(raw, filePath, relPath, { mime });
  }
}
