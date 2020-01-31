import test from 'ava';
import { splitMetaStr } from '../util';

test('normal', t => {
  const [a, b] = splitMetaStr(`
---
a
---

b
  `);

  t.snapshot(a);
  t.snapshot(b);
});
