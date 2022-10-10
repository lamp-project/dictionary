import { existsSync, mkdirSync, writeFileSync } from 'fs';
import _ from 'lodash';
import entries from './utils/entries.js';
import { definitions } from './utils/definitions.js';
import { join } from 'path';

let counter = 0;
entries.forEach(([word,rank, ratio]) => {
  counter++;
  const dir = join(
    process.cwd(),
    `../${word.substring(0, 3).split('').join('/')}`
  );
  const POSs = _.groupBy(
    _.filter(definitions, { 0: word }).map(([word, ...rest]) => rest),
    '0'
  );
  Object.keys(POSs).forEach((POS) => {
    POSs[POS] = POSs[POS].map(([POS, def]) => def);
  });
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(
    `${dir}/${word}.json`,
    JSON.stringify(
      {
        word,
        rank: +rank,
        ratio: +ratio,
        definitions: POSs,
      },
      null,
      '\t'
    )
  );
  if (counter % 1000) {
    console.log(
      `1000 words processed. ${((counter * 100) / entries.length).toFixed(2)}%`
    );
  }
});
