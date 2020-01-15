const assert = require('assert');
const fs = require('fs');
const shake = require('./shake');
const spin = require('./spin');

const effects = { spin, shake };

try {
  const input = process.argv[2];
  const output = process.argv[3];
  const effect = process.argv[4] || 'shake';
  assert(input, 'input filename argument expected');
  assert(output, 'output filename argument expected');

  effects[effect](fs.createReadStream(input), fs.createWriteStream(output));
} catch (e) {
  console.error(e.message || e);
}
