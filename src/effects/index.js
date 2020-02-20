const GIFEncoder = require('gifencoder');
const Jimp = require('jimp');

const streamToBuffer = require('../util/streamToBuffer');
const bufferToStream = require('../util/bufferToStream');
const newImage = require('../util/newImage');

const pulse = require('./pulse');
const shake = require('./shake');
const spin = require('./spin');

const FRAMES = 16;
const MAX_DIMENSION = 512;

module.exports = async (inputStream, outputStream, effect = 'pulse|shake|spin') => {
  const inputBuffer = await streamToBuffer(inputStream);
  const image = await Jimp.read(inputBuffer);

  if (image.bitmap.height > MAX_DIMENSION || image.bitmap.width > MAX_DIMENSION) {
    image.scaleToFit(MAX_DIMENSION, MAX_DIMENSION);
  }

  const { height, width } = image.bitmap;

  const blank = await newImage(width, height);
  const encoder = new GIFEncoder(width, height);

  const frames = [];
  let transparent = null;

  for (var i = 0; i < FRAMES; i++) {
    let nextFrame = image.clone();

    if (effect.indexOf('pulse') !== -1) {
      nextFrame = pulse(nextFrame, blank.opacity(0).clone(), i, height, width);
    }

    if (effect.indexOf('shake') !== -1) {
      nextFrame = shake(nextFrame, blank.opacity(0).clone(), i, height, width);
    }

    if (effect.indexOf('spin') !== -1) {
      nextFrame = spin(nextFrame, i, FRAMES);
    }

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

  const output = await gifOutput

  if (outputStream) {
    bufferToStream(output).pipe(outputStream);
  }

  return output;
}
