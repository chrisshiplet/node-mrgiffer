const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');
const streamToBuffer = require('./util/streamToBuffer');
const bufferToStream = require('./util/bufferToStream');

const FRAMES = 16;
const MAX_DIMENSION = 512;

module.exports = function shake(inputStream, outputStream) {
  return streamToBuffer(inputStream)
    .then(inputBuffer => Jimp.read(inputBuffer))
    .then(image => {
      if (image.bitmap.height > MAX_DIMENSION || image.bitmap.width > MAX_DIMENSION) {
        image.scaleToFit(MAX_DIMENSION, MAX_DIMENSION);
      }

      const { height, width } = image.bitmap;

      const encoder = new GIFEncoder(width, height);

      const frames = [];
      let transparent = null;

      for (var i = 0; i < FRAMES; i++) {
        const nextFrame = image.clone();

        nextFrame.rotate(i * (360 / FRAMES), false);

        nextFrame.scan(0, 0, width, height, (x, y, idx) => {
          if (nextFrame.bitmap.data[idx + 3] < 255) {
            transparent = 0xff00ff;
          }
        });

        frames.push(nextFrame.bitmap.data);
      }

      const gifOutput = streamToBuffer(encoder.createWriteStream({ repeat: 0, delay: 0, quality: 10 }));

      encoder.start();
      encoder.setTransparent(transparent);
      encoder.setRepeat(0);
      encoder.setDelay(0);
      encoder.setQuality(10);

      frames.forEach(frame => encoder.addFrame(frame));

      encoder.finish();

      return gifOutput.then(output => {
        if (outputStream) {
          bufferToStream(output).pipe(outputStream);
        }
        return output;
      });
    });
}
