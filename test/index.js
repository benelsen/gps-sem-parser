
import fs from 'fs';
import path from 'path';
import test from 'tape';
import moment from 'moment';
import pad from 'pad';

import sem from '../src';

test('validate output', t => {

  const testSems = fs.readdirSync('./test/data')
    .map(file => file.split(/[-.]/))
    .filter(file => file[2] == "sem")
    .map(file => [parseInt(file[0]), parseInt(file[1])])

  t.plan(testSems.length);

  for (let [y,i] of testSems) {

    const rawAlmanac = fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.sem`), 'utf8');
    const result = sem(rawAlmanac, null, y);

    // if ( !fs.existsSync(path.join(__dirname, `data/${y}-${pad(3, i, '0')}.json`)) ) {
    //     fs.writeFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.json`), JSON.stringify(result, null, 2), 'utf8')
    // }

    const refAlmanac = JSON.parse(fs.readFileSync( path.join(__dirname, `data/${y}-${pad(3, i, '0')}.json`), 'utf8' ));
    t.deepEqual(result, refAlmanac);
  }

});
