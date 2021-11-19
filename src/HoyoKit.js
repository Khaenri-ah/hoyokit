const axios = require('axios');
const { DS } = require('./utils.js');

const HoyolabAccount = require('./types/HoyolabAccount.js');
const GenshinAccount = require('./types/GenshinAccount.js');
const utils = require('./utils.js');

/**
 * A hoyolab UID
 * @typedef {(number|string)} HoyolabUID
 */
/**
 * A genshin UID
 * @typedef {(number|string)} GenshinUID
 */

module.exports = class HoyoKit {
  /**
   * The main HoyoKit class.
   * @constructor
   * @param {string} cookies - to get your cookies, go to https://webstatic-sea.mihoyo.com/app/community-game-records-sea and input `document.cookie` in your browser's developer console. You need the entire string it returns. 
   */
  constructor(cookies) {
    this.cookie = cookies;
  }

  /**
   * Fetches a hoyolab account by its UID
   * @param {HoyolabUID} uid 
   * @returns {HoyolabAccount} A hoyolab account
   */
  async fetchHoyolabAccount(uid) {
    uid = uid.toString();
    const res = await this.request('get', 'https://bbs-api-os.mihoyo.com/community/user/wapi/getUserFullInfo', { uid });
    return new HoyolabAccount(this, res.data);
  }

  /**
   * Fetches a genshin account by its UID
   * @param {GenshinUID} uid 
   * @param {boolean} full - fetch full character details?
   * @returns {GenshinAccount} A Genshin account
   */
  async fetchGenshinAccount(uid, full=false) {
    uid = uid.toString();
    const res = await this.request('get', 'https://bbs-api-os.mihoyo.com/game_record/genshin/api/index', { server: utils.server(uid), role_id: uid });
    res.data.uid = uid;
    const account = new GenshinAccount(this, res.data);
    if (full) await account.fetchCharacters();
    return account;
  }

  /**
   * @private
   */
  async request(method, path, data) {
    let query, body
    if (method.toLowerCase() === 'get') {
      query = data
    } else {
      body = data
    }

    const res = await axios({
      method,
      url: path,
      data: body,
      params: query,
      withCredentials: true,
      headers: {
        DS: DS(),
        Origin: 'https://webstatic-sea.hoyolab.com',
        Referer: 'https://webstatic-sea.hoyolab.com/',
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US;q=0.5',
        'x-rpc-language': 'en-us',
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0',
        Cookie: this.cookie,
      }
    });
    return res.data;
  }
}