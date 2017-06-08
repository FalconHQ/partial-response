# partial-response

[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/amnisflow/partial-response)

An Express.js middleware to byte serve content

## Install

```bash
npm install --save partial-response
```

## Usage

`partial-response` inserts a method (`sendPartial`) on the response object.

It takes a file path as parameter, and will serve the file with proper `Range` headers.

Like so:

```javascript
const pr = require('partial-response')

app.get('/cat-pic', pr, (req, res) => {
  res.sendPartial('./cat-pic1.jpg')
})
```

## License

MIT
