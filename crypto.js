// Most of the code in this file is from https://www.npmjs.com/package/@genshin-kit/core, with only some small changes
const crypto = require('crypto');

function randomString(e) {
  const s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const res = []
  for (let i = 0; i < e; ++i) {
    res.push(s[Math.floor(Math.random() * s.length)])
  }
  return res.join('')
}

module.exports = function getDS() {
  const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt'
  const time = Math.floor(Date.now() / 1000)
  const random = randomString(6)

  const c = crypto
    .createHash('md5')
    .update(`salt=${salt}&t=${time}&r=${random}`)
    .digest('hex')
  return `${time},${random},${c}`
}