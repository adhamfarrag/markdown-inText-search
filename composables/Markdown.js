const marked = require('marked').marked
const PlainTextRenderer = require('marked-plaintext')
const renderer = new PlainTextRenderer()

function convertToPlainText(content) {
  return marked(content, { renderer: renderer })
}

export { convertToPlainText }
