const assert = require('assert');
const fs = require('fs');

const effects = require('./effects');

try {
  const input = process.argv[2];
  const output = process.argv[3];
  const effect = process.argv[4] || 'shake';
  assert(input, 'input filename argument expected');
  assert(output, 'output filename argument expected');

  effects(fs.createReadStream(input), fs.createWriteStream(output), effect);
} catch (e) {
  console.error(e.message || e);
}
