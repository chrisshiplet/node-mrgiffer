const assert = require('assert');
const fs = require('fs');
const shake = require('./shake');

try {
  const input = process.argv[2];
  const output = process.argv[3];
  assert(input, 'input filename argument expected');
  assert(output, 'output filename argument expected');

  shake(fs.createReadStream(input), fs.createWriteStream(output))
} catch (e) {
  console.error(e.message || e);
}
