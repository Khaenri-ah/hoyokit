const crypto = require('crypto');

module.exports = {
  // adapted from https://github.com/genshin-kit/genshin-kit-node/blob/master/packages/core/src/module/_getDS.ts
  DS() {
    const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt';
    const time = Math.floor(Date.now() / 1000);
    const s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const random = Array(6).fill(null).map(()=>s[Math.floor(Math.random()*s.length)]).join('');

    const c = crypto
      .createHash('md5')
      .update(`salt=${salt}&t=${time}&r=${random}`)
      .digest('hex');
    return `${time},${random},${c}`;
  },

  server: uid => ({
    6: 'os_usa',
    7: 'os_euro',
    8: 'os_asia',
    9: 'os_cht',
  })[uid[0]],
  objectBits: object => Object.entries(object).map(([_,v],i)=>v<<i).reduce((a,v)=>a+v),
  element: str => ['Anemo', 'Cryo', 'Dendro', 'Electro', 'Geo', 'Hydro', 'Pyro'].indexOf(str),
  weaponType: type => [1,10,11,12,13].indexOf(type),
}