const http = require('node:http');
const { validateData } = require('./validateData.js');
const { convertToCase } = require('./convertToCase/convertToCase.js');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const textToConvert = url.pathname.slice(1);
    const toCase = url.searchParams.get('toCase')?.toUpperCase();

    const [isCorrect, errors] = validateData(textToConvert, toCase);

    res.setHeader('content-type', 'application/json');

    if (isCorrect) {
      const { originalCase, convertedText } = convertToCase(
        textToConvert,
        toCase,
      );

      const body = {
        originalCase,
        targetCase: toCase,
        originalText: textToConvert,
        convertedText,
      };

      res.statusCode = 200;
      res.statusText = 'OK';
      res.write(JSON.stringify(body));
    } else {
      res.statusCode = 400;
      res.statusText = 'Bad request';
      res.write(JSON.stringify(errors));
    }

    res.end();
  });
}

// const server = serverInit();

// server.listen(3000, () => {
//   console.log(`Server is running on port ${3000}`);
// });

module.exports = {
  createServer,
};
