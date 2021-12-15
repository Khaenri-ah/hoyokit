const HoyoKit = require('../HoyoKit.js');
const HoyolabAccount = require('./HoyolabAccount.js');
const GenshinAccount = require('./GenshinAccount.js');

module.exports = class GameAccount {
  /**
   * @private
   */
  constructor(owner, data) {
    /** @type {HoyolabAccount} */
    this.owner = owner;
    /** @type {HoyoKit} */
    this.hoyokit = owner.hoyokit;

    /** @type {number} */
    this.game = data.game_id;
    /** @type {string} */
    this.uid = data.game_role_id;
    /** @type {string} */
    this.name = data.nickname;
    /** @type {6|7|8|9} */
    this.region = ({
      os_usa: 6,
      os_euro: 7,
      os_asia: 8,
      os_cht: 9,
    })[data.region];
    /** @type {number} */
    this.ar = data.level;
  }

  /**
   * Fetches the genshin account that is this game account
   * @param {boolean} full 
   * @returns {GenshinAccount}
   */
  async fetchGenshinAccount(full) {
    const acc = await this.hoyokit.fetchGenshinAccount(this.uid, full);
    /** @type {GenshinAccount} */
    this.genshin = acc;
    return acc;
  }
}