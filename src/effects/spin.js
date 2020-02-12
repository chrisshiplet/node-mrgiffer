module.exports = function spin(nextFrame, index, frames) {
  return nextFrame.rotate(index * (360 / frames), false);
}