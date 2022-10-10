// @ts-check
import { getStem, stopWords } from '@lamp-project/nlp-utils';
import _ from 'lodash';
import { importTSV } from '../../../words-frequency/.logic/utils.js';

const source = importTSV('../../words-frequency/english-words-frequency.tsv');

const wordsListMap = new Map();

source.forEach(([word, count]) => {
  // @ts-ignore
  count = +count;
  const stem = getStem(word) || word;
  if (stopWords.includes(stem)) {
    return;
  }
  if (wordsListMap.has(stem)) {
    wordsListMap.set(stem, count + wordsListMap.get(stem));
  } else {
    wordsListMap.set(stem, count);
  }
});

const wordsList = [...wordsListMap.entries()];

const sum = _.sumBy(wordsList, '1');

let counts = [];

wordsList.forEach(([, count]) => {
  if (!counts.includes(count)) {
    counts.push(count);
  }
});

counts = _.sortBy(counts).reverse();

export default wordsList.map(([word, count], index) => [
  word,
  // @ts-ignore
  counts.indexOf(count) + 1,
  ((+count * 100) / sum).toFixed(6),
]);
