const request = require("request");
const fs = require("fs");
const path = require("path");

const effects = require('./effects');

exports.handler = function(event, context, callback) {
  console.log(event);

  const effect =
    (event.queryStringParameters && event.queryStringParameters.effect) ||
    "shake";

  if (
    event.queryStringParameters &&
    event.queryStringParameters.input
  ) {
    effects(request(event.queryStringParameters.input), null, effect).then(buffer => {
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "image/gif"
        },
        body: buffer.toString("base64"),
        isBase64Encoded: true
      };
      callback(null, response);
    });
  } else {
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: fs.readFileSync(path.join(__dirname, "./index.html")).toString()
    };
    console.log(response);
    callback(null, response);
  }
};
