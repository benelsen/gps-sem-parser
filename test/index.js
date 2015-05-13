
import fs from 'fs';
import path from 'path';
import test from 'tape';
import moment from 'moment';
import pad from 'pad';

import sem from '../src';

const gpstimeOrigin = moment.utc("1980-01-06T00:00:00.000Z").unix();

test('validate output', t => {

  t.plan(4);

  const testSems = [[1998, 15], [2007, 256], [2007, 257], [2015, 132]];

  for (let [y,i] of testSems) {

    const rawAlmanac = fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.sem`), 'utf8');
    const refAlmanac = JSON.parse(fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.json`), 'utf8' ));

    const gpsEpoch = Math.floor( (moment(`${y}-${pad(3, i, '0')}`).unix() - gpstimeOrigin) / (1024*7*86400) );
    const result = sem(rawAlmanac, gpsEpoch);

    t.deepEqual(result, refAlmanac);
  }

});
