const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const streamToBuffer = require('./util/streamToBuffer');
const bufferToStream = require('./util/bufferToStream');
const randomInt = require('./util/randomInt');

const MAGIC_NUMBER = 0.1;
const FRAMES = 6;
const MAX_DIMENSION = 512;

module.exports = function shake(inputStream, outputStream, options = { fps: 500, }) {
  return streamToBuffer(inputStream)
    .then(inputBuffer => Jimp.read(inputBuffer))
    .then(image => {
      if (image.bitmap.height > MAX_DIMENSION || image.bitmap.width > MAX_DIMENSION) {
        image.scaleToFit(MAX_DIMENSION, MAX_DIMENSION);
      }

      const { height, width } = image.bitmap;

      const marginHeight = Math.floor(height * MAGIC_NUMBER);
      const marginWidth = Math.floor(width * MAGIC_NUMBER);
      let outputHeight = height - marginHeight;
      let outputWidth = width - marginWidth;

      const encoder = new GIFEncoder(outputWidth, outputHeight);

      const frames = [];
      let transparent = null;

      for (var i = 0; i < FRAMES; i++) {
        const nextFrame = image.clone();

        const centerX = Math.floor(marginWidth / 2);
        const centerY = Math.floor(marginHeight / 2);

        let randX, randY;

        switch (i % 4) {
          case 0:
            // go NW
            randX = randomInt(centerX);
            randY = randomInt(centerY);
            break;
          case 1:
            // go SE
            randX = centerX + randomInt(centerX);
            randY = centerY + randomInt(centerY);
            break;
          case 2:
            // go NE
            randX = centerX + randomInt(centerX);
            randY = randomInt(centerY);
            break;
          case 3:
            // go SW
            randX = randomInt(centerX);
            randY = centerY + randomInt(centerY);
            break;
        }

        nextFrame.crop(randX, randY, outputWidth, outputHeight);

        nextFrame.scan(0, 0, outputWidth, outputHeight, (x, y, idx) => {
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

      return gifOutput
        .then(output => imagemin.buffer(output, {
          use: [
            imageminGifsicle({
              optimizationLevel: 2,
              colors: 128,
            }),
          ],
        }).then(optimizedBuffer => {
          if (outputStream) {
            bufferToStream(optimizedBuffer).pipe(outputStream);
          }
          return optimizedBuffer;
        }));
    });
}
