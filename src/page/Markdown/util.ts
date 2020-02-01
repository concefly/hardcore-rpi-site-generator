import * as yaml from 'js-yaml';
import * as moment from 'moment';
import * as _ from 'lodash';

export function splitMetaStr(raw: string): [string, string] {
  const list = raw.split('\n');

  const indexList: number[] = [];

  for (let i = 0; i < list.length && indexList.length < 2; i++) {
    const line = list[i];

    if (line.startsWith('---')) {
      indexList.push(i);
      continue;
    }
  }

  if (indexList.length < 2) {
    return ['', raw];
  }

  const metaStr = list.slice(indexList[0] + 1, indexList[1]).join('\n');
  const mdStr = list.slice(indexList[1] + 1).join('\n');

  return [metaStr, mdStr];
}

export interface IMdMeta {
  id: string;
  title: string;
  createDate: moment.Moment;
  updateDate: moment.Moment;
  categories: string[];
  tags: string[];
}

export function getMetaFromRaw(metaStr: string): IMdMeta {
  const meta: any = yaml.safeLoad(metaStr);

  const id = meta && meta.id && meta.id + '';
  const title = meta && meta.title && meta.title + '';
  const createDate = meta?.createDate ? moment(meta.createDate) : moment();
  const updateDate = meta?.updateDate ? moment(meta.updateDate) : moment();
  const categories: string[] = meta
    ? _.compact(_.isArray(meta.categories) ? meta.categories : [meta.categories])
    : [];
  const tags: string[] = meta ? _.compact(_.isArray(meta.tags) ? meta.tags : [meta.tags]) : [];

  return { id, title, createDate, updateDate, categories, tags };
}
