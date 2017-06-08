const debug = require('debug')('partial')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const parseRange = require('range-parser')
const mimeTypes = require('mime-types')

const partialResponse = (req, res, next) => {
  res.sendPartial = (file) => {
    const range = req.get('Range')
    const mime = mimeTypes.lookup(file)
    debug('range: ', range)
    if (range) {
      fs.statAsync(file)
      .then(stat => {
        const { size } = stat
        parsedRange = parseRange(size, range)
        debug('parsedRange', parsedRange)
        if (Array.isArray(parsedRange)) {
          let readStream = fs.createReadStream(file, parsedRange[0])
          let content
          readStream.on('data', chunk => {
            debug('on data', chunk.toString())
            if (content === undefined) content = chunk
            else content = content.concat(chunk)
          })
          readStream.on('end', () => {
            debug('rs end')
            res.status(206)
            res.set('Content-Type', mime)
            res.set('Content-Range', `bytes ${readStream.start}-${readStream.end}/${size}`)
            res.send(content)
          })
        } else {
          return Promise.reject({status: 416, size: size})
        }
      })
      .catch(err => {
        res.status(err.status)
        res.set('Content-Range', `bytes */${err.size}`)
      })
    } else {
      res.set('Accept-Ranges', 'bytes')
      fs.readFileAsync(file)
      .then(file => {
        debug('susupdsf', file)
        res.set('Content-Type', mime)
        res.send(file)
      })
    }
  }

  next()
}

module.exports = partialResponse
