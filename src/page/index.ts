import * as fs from 'fs';
import * as path from 'path';
import { Markdown } from './Markdown';
import { PlainText } from './PlainText';
import { BasePage } from './BasePage';

export function createPage(filePath: string): BasePage {
  if (!fs.existsSync(filePath)) return null;

  const extname = path.extname(filePath);
  const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });

  switch (extname) {
    case '.md':
      return new Markdown(raw, filePath);
    default:
      return new PlainText(raw, filePath);
  }
}
