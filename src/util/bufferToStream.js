const Duplex = require('stream').Duplex;

module.exports = function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
