const request = require('request');
const shake = require('./shake');

exports.handler = function(event, context, callback) {
  console.log(event);

  if (event.queryStringParameters.input) {
    shake(request(event.queryStringParameters.input))
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
