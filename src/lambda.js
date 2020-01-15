const request = require('request');
const shake = require('./shake');
const spin = require('./spin');

const effects = { spin, shake };

exports.handler = function(event, context, callback) {
  console.log(event);

  const effect = event.queryStringParameters.effect || 'shake';

  if (event.queryStringParameters.input && effects[effect]) {
    effects[effect](request(event.queryStringParameters.input))
      .then(buffer => {
        var response = {
          statusCode: 200,
          headers: {
            "Content-Type" : "image/gif"
          },
          body: buffer.toString('base64'),
          isBase64Encoded: true,
        };
        callback(null, response);
      });
  } else {
    const err = 'Expected input param';
    console.error(err);
    callback(err);
  }
}
