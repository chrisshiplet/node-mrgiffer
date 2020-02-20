const getExplosionFrame = require('../util/getExplosionFrame');

const cropRotate = (
  src,
  cropX,
  cropY,
  cropHeight,
  cropWidth
) => src.clone().crop(
  cropX,
  cropY,
  cropWidth,
  cropHeight
);

module.exports = async (nextFrame, blank, original, index, height, width) => {
  let explosionFrame;
  let cropHeight;
  let cropWidth;

  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      // Keep original unchanged
      return nextFrame;
    case 4:
      // Add explosion 0
      explosionFrame = await getExplosionFrame(0, height, width);
      return nextFrame.composite(
        explosionFrame,
        (width / 2) - (explosionFrame.bitmap.width / 2),
        (height / 2) - (explosionFrame.bitmap.height / 2)
      );
    case 5:
      explosionFrame = await getExplosionFrame(1, height, width);
      cropHeight = (height) * .1;
      cropWidth = (width) * .1;
      break;
    case 6:
      explosionFrame = await getExplosionFrame(2, height, width);
      cropHeight = (height) * .1;
      cropWidth = (width) * .1;
      break;
    case 7:
      explosionFrame = await getExplosionFrame(3, height, width);
      cropHeight = (height) * .2;
      cropWidth = (width) * .2;
      break;
    case 8:
      explosionFrame = await getExplosionFrame(4, height, width);
      cropHeight = (height) * .2;
      cropWidth = (width) * .2;
      break;
    case 9:
      explosionFrame = await getExplosionFrame(5, height, width);
      cropHeight = (height) * .3;
      cropWidth = (width) * .3;
      break;
    case 10:
      explosionFrame = await getExplosionFrame(6, height, width);
      cropHeight = (height) * .3;
      cropWidth = (width) * .3;
      break;
    case 11:
      explosionFrame = await getExplosionFrame(7, height, width);
      cropHeight = (height) * .4;
      cropWidth = (width) * .4;
      break;
    case 12:
      explosionFrame = await getExplosionFrame(8, height, width);
      cropHeight = (height) * .4;
      cropWidth = (width) * .4;
      break;
    case 13:
      explosionFrame = await getExplosionFrame(9, height, width);
      return blank.composite(
        explosionFrame,
        (width / 2) - (explosionFrame.bitmap.width / 2),
        (height / 2) - (explosionFrame.bitmap.height / 2)
      );
    case 14:
      explosionFrame = await getExplosionFrame(10, height, width);
      return blank.composite(
        explosionFrame,
        (width / 2) - (explosionFrame.bitmap.width / 2),
        (height / 2) - (explosionFrame.bitmap.height / 2)
      );
    case 15:
      explosionFrame = await getExplosionFrame(11, height, width);
      return blank.composite(
        explosionFrame,
        (width / 2) - (explosionFrame.bitmap.width / 2),
        (height / 2) - (explosionFrame.bitmap.height / 2)
      );
  }

  const q1 = cropRotate(
    original,
    cropWidth,
    cropHeight,
    width / 2 - cropWidth,
    height / 2 - cropHeight,
    315
  );
  const q2 = cropRotate(
    original,
    width / 2,
    cropHeight,
    width / 2 - cropWidth,
    height / 2 - cropHeight,
    45
  );
  const q3 = cropRotate(
    original,
    0,
    height / 2 + cropHeight,
    width / 2 - cropWidth,
    height / 2 - cropHeight,
    225
  );
  const q4 = cropRotate(
    original,
    width / 2 + cropWidth,
    height / 2 + cropHeight,
    width / 2 - cropWidth,
    height / 2 - cropHeight,
    135
  );

  return blank.blit(q1, 0, 0)
    .blit(q2, width / 2 + cropWidth, 0)
    .blit(q3, 0, height / 2 + cropHeight)
    .blit(q4, width / 2 + cropWidth, height / 2 + cropHeight)
    .composite(
      explosionFrame,
      (width / 2) - (explosionFrame.bitmap.width / 2),
      (height / 2) - (explosionFrame.bitmap.height / 2)
    );
}
