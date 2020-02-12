const randomInt = require('../util/randomInt');

const MAGIC_NUMBER = 0.1;

module.exports = function shake(nextFrame, newFrame, index, height, width) {
  let blitX, blitY, cropX, cropY;

  switch (index % 4) {
    case 0:
      // go NW
      blitX = 0;
      blitY = 0;
      cropX = randomInt(MAGIC_NUMBER * width);
      cropY = randomInt(MAGIC_NUMBER * width);
      break;
    case 1:
      // go SE
      blitX = randomInt(MAGIC_NUMBER * width);
      blitY = randomInt(MAGIC_NUMBER * width);
      cropX = 0;
      cropY = 0;
      break;
    case 2:
      // go NE
      blitX = 0;
      blitY = randomInt(MAGIC_NUMBER * width);
      cropX = randomInt(MAGIC_NUMBER * width);
      cropY = 0;
      break;
    case 3:
      // go SW
      blitX = randomInt(MAGIC_NUMBER * width);
      blitY = 0;
      cropX = 0;
      cropY = randomInt(MAGIC_NUMBER * width);
      break;
  }

  return newFrame.blit(
    nextFrame,
    blitX,
    blitY,
    cropX,
    cropY,
    width - cropX,
    height - cropY
  );
}
