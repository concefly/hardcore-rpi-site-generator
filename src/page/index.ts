import * as fs from 'fs';
import * as path from 'path';
import { Markdown } from './Markdown';
import { BasePage } from './BasePage';

export function createPage(filePath: string, relPath: string): BasePage {
  if (!fs.existsSync(filePath)) return null;

  const extname = path.extname(filePath);
  const raw = fs.readFileSync(filePath);

  switch (extname) {
    case '.md':
      return new Markdown(raw, filePath, relPath);
    default:
      return new BasePage(raw, filePath, relPath);
  }
}
