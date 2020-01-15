const Jimp = require('jimp');

module.exports = function newImage(width, height) {
  return new Promise(resolve => {
    new Jimp(width, height, (err, image) => resolve(image));
  });
}
