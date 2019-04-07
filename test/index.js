
import fs from 'fs';
import path from 'path';
import test from 'tape';
import moment from 'moment';
import pad from 'pad';

import sem from '../src';

const gpstimeOrigin = moment.utc("1980-01-06T00:00:00.000Z").unix();

test('validate output', t => {

  t.plan(6);

  const testSems = [[1998, 15], [2007, 256], [2007, 257], [2015, 132], [2019, 94], [2019, 95]];

  for (let [y,i] of testSems) {

    const rawAlmanac = fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.sem`), 'utf8');
    const result = sem(rawAlmanac, null, y);

    const refAlmanac = JSON.parse(fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.json`), 'utf8' ));
    t.deepEqual(result, refAlmanac);
  }

});
