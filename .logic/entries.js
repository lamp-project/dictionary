// @ts-check
import _ from 'lodash';
import { exportTSV } from '../../words-frequency/.logic/utils.js';
import entries from './utils/entries.js';

async function main() {
  exportTSV('entries', _.orderBy(entries, ['2', '0'], ['desc', 'asc']));
}

console.time('executed');
main().finally(() => console.timeEnd('executed'));
