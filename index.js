const axios = require('axios');
const getDS = require('./crypto.js');

const base = 'https://bbs-api-os.mihoyo.com/';

const server = uid => ({
  6: 'os_usa',
  7: 'os_euro',
  8: 'os_asia',
  9: 'os_cht',
})[uid.charAt(0)];

module.exports = class HoyoKit {
  constructor(cookies) {
    this.cookie = cookies;
  }

  async getUserInfo(uid) {
    const res = await this.request('get', 'community/user/wapi/getUserFullInfo', { uid });
    return res.data;
  }

  async getCharacterList(uid) {
    const res = await this.request('get', 'game_record/card/wapi/getGameRecordCard', { uid });
    return res.data.list;
  }

  async getCharacterInfo(uid) {
    const res = await this.request('get', 'game_record/genshin/api/index', { server: server(uid), role_id: uid });
    return res.data;
  }

  async getAbyssInfo(uid, id) {
    const res = await this.request('get', 'game_record/genshin/api/spiralAbyss', { server: server(uid), role_id: uid, schedule_type: id });
    return res.data;
  }

  async getFullCharacterInfo(uid) {
    const characters = await this.getCharacterInfo(uid).then(d=>d.avatars.map(a=>a.id));
    const res = await this.request('post', 'game_record/genshin/api/character', { server: server(uid), role_id: uid, character_ids: characters });
    return res.data;
  }

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