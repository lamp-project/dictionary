// @ts-check
import _ from 'lodash';
import { exportTSV } from '../../words-frequency/.logic/utils.js';
import { WordNet } from '../../words-frequency/.logic/wordnet.js';
import entries from './utils/entries.js';
import { definitions } from './utils/definitions.js';

const blackList = ['con'];

async function main() {
  const chuncks = _.chunk(entries, 100);
  let counter = 0;
  for (const chunck of chuncks) {
    await Promise.all(
      chunck.map(async ([word]) => {
        counter++;
        // @ts-ignore
        if (blackList.includes(word)) return;
        const definition = _.find(definitions, { 0: word });
        if (definition) {
          return;
        }
        // @ts-ignore
        const result = await WordNet.definitions(word);
        result.forEach(({ gloss, POS }) =>
          definitions.push([
            word,
            POS,
            gloss.split(';').shift().replace(/\t/g, ' '),
          ])
        );
      })
    );
    console.log(
      `100 new words processed. dictionary size: ${definitions.length}. ${(
        (counter * 100) /
        entries.length
      ).toFixed(2)}%`
    );
  }
  exportTSV('definitions', _.sortBy(definitions, '0'));
}

console.time('executed');
main().finally(() => console.timeEnd('executed'));
