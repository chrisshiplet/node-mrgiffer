const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');
const streamToBuffer = require('./util/streamToBuffer');
const bufferToStream = require('./util/bufferToStream');
const newImage = require('./util/newImage');

const FRAMES = 16;
const MAX_DIMENSION = 512;

const scaleMap = [0, .875, .75, .625, .5, .625, .75, .875, 0, 1.125, 1.25, 1.375, 1.5, 1.375, 1.25, 1.125];

module.exports = function pulse(inputStream, outputStream) {
  return streamToBuffer(inputStream)
    .then(inputBuffer => Jimp.read(inputBuffer))
    .then(image => {
      if (image.bitmap.height > MAX_DIMENSION || image.bitmap.width > MAX_DIMENSION) {
        image.scaleToFit(MAX_DIMENSION, MAX_DIMENSION);
      }

      const { height, width } = image.bitmap;

      return newImage(width, height)
        .then(blank => {
          const encoder = new GIFEncoder(width, height);

          const frames = [];
          let transparent = null;

          for (var i = 0; i < FRAMES; i++) {
            const nextFrame = image.clone();
            let newFrame = blank.opacity(0).clone();

            if (scaleMap[i]) {
              nextFrame.scale(scaleMap[i]);

              newFrame = newFrame.blit(
                nextFrame,
                (width - nextFrame.bitmap.width) / 2,
                (height - nextFrame.bitmap.height) / 2
              );
            } else {
              newFrame = nextFrame;
            }

            newFrame.scan(0, 0, width, height, (x, y, idx) => {
              if (newFrame.bitmap.data[idx + 3] < 255) {
                transparent = 0xff00ff;
              }
            });

            frames.push(newFrame.bitmap.data);
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
    });
}
