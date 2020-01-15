const request = require("request");
const fs = require("fs");
const path = require("path");

const pulse = require("./pulse");
const shake = require("./shake");
const spin = require("./spin");

const effects = { pulse, spin, shake };

exports.handler = function(event, context, callback) {
  console.log(event);

  const effect =
    (event.queryStringParameters && event.queryStringParameters.effect) ||
    "shake";

  if (
    event.queryStringParameters &&
    event.queryStringParameters.input &&
    effects[effect]
  ) {
    effects[effect](request(event.queryStringParameters.input)).then(buffer => {
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
