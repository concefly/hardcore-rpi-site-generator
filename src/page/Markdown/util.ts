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
  title: any;
  createDate: moment.Moment;
  updateDate: moment.Moment;
  categories: string[];
  tags: string[];
}

export function getMetaFromRaw(metaStr: string): IMdMeta {
  const meta: {
    title?: any;
    createDate?: any;
    updateDate?: any;
    categories?: any;
    tags?: any;
  } = yaml.safeLoad(metaStr);

  const title = meta && meta.title + '';
  const createDate = meta?.createDate ? moment(meta.createDate) : moment();
  const updateDate = meta?.updateDate ? moment(meta.updateDate) : moment();
  const categories = meta
    ? _.compact(_.isArray(meta.categories) ? meta.categories : [meta.categories])
    : [];
  const tags = meta ? _.compact(_.isArray(meta.tags) ? meta.tags : [meta.tags]) : [];

  return { title, createDate, updateDate, categories, tags };
}
