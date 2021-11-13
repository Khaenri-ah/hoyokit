const axios = require('axios');
const getDS = require('./crypto.js');

const base = 'https://bbs-api-os.mihoyo.com/';

const server = uid => ({
  6: 'os_usa',
  7: 'os_euro',
  8: 'os_asia',
  9: 'os_cht',
})[uid.charAt(0)];

parseUID = uid => uid.toString();

module.exports = class HoyoKit {
  /**
   * The main HoyoKit class.
   * @constructor
   * @exports
   * @param {string} cookies - to get your cookies, go to https://webstatic-sea.mihoyo.com/app/community-game-records-sea and input `document.cookie` in your browser's developer console. You need the entire string it returns. 
   */
  constructor(cookies) {
    this.cookie = cookies;
  }

  /**
   * Fetch a MiHoYo account.
   * @param {string|number} uid - A MiHoYo UID.
   * @returns {Promise<object>} MiHoYo account data.
   */
  async mihoyo(uid) {
    uid = parseUID(uid);
    const res = await this.request('get', 'community/user/wapi/getUserFullInfo', { uid });
    return res.data;
  }

  /**
   * Fetch a list of Genshin accounts linked to a MiHoYo account.
   * @param {string|number} uid - A MiHoYo UID.
   * @returns {Promise<object[]>} Array of Genshin account data.
   */
  async accounts(uid) {
    uid = parseUID(uid);
    const res = await this.request('get', 'game_record/card/wapi/getGameRecordCard', { uid });
    return res.data.list;
  }

  /**
   * Fetch a Genshin account.
   * @param {string|number} uid - A Genshin UID.
   * @returns {Promise<object>} Genshin account data.
   */
  async genshin(uid) {
    uid = parseUID(uid);
    const res = await this.request('get', 'game_record/genshin/api/index', { server: server(uid), role_id: uid });
    return res.data;
  }

  /**
   * Fetch the Spiral Abyss stats of a Genshin account.
   * @param {string|number} uid - A Genshin UID.
   * @param {number} [id=1] - The Abyss period ID, 1: current abyss, 2: previous abyss, etc.
   * @returns {Promise<object>} Abyss data.
   */
  async abyss(uid, id=1) {
    uid = parseUID(uid);
    const res = await this.request('get', 'game_record/genshin/api/spiralAbyss', { server: server(uid), role_id: uid, schedule_type: id });
    return res.data;
  }

  /**
   * Fetch detailed information on all the characters a Genshin account has.
   * @param {String|number} uid - A Genshin UID.
   * @returns {Promise<object[]>} Array of character data
   */
  async characters(uid) {
    uid = parseUID(uid);
    const characters = await this.genshin(uid).then(d=>d.avatars.map(a=>a.id));
    const res = await this.request('post', 'game_record/genshin/api/character', { server: server(uid), role_id: uid, character_ids: characters });
    return res.data.avatars;
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
      url: path.startsWith('http') ? path : base+path,
      data: body,
      params: query,
      withCredentials: true,
      headers: {
        DS: getDS(),
        Origin: 'https://webstatic-sea.hoyolab.com',
        Referer: 'https://webstatic-sea.hoyolab.com/',
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US;q=0.5',
        'x-rpc-language': 'en-us',
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        Cookie: this.cookie,
      }
    });
    return res.data;
  }
}