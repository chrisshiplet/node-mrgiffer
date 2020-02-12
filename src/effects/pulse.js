const scaleMap = [0, .875, .75, .625, .5, .625, .75, .875, 0, 1.125, 1.25, 1.375, 1.5, 1.375, 1.25, 1.125];

module.exports = function pulse(nextFrame, newFrame, index, height, width) {
  if (scaleMap[index]) {
    nextFrame.scale(scaleMap[index]);

    return newFrame.blit(
      nextFrame,
      (width - nextFrame.bitmap.width) / 2,
      (height - nextFrame.bitmap.height) / 2
    );
  }

  return nextFrame;
}