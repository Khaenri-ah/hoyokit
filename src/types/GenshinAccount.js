const HoyoKit = require('../HoyoKit.js');
const Character = require('./Character.js');
const AbyssData = require('./AbyssData.js');
const utils = require('../utils.js');

/**
 * A hoyolab UID
 * @typedef {(number|string)} HoyolabUID
 */
/**
 * A genshin UID
 * @typedef {(number|string)} GenshinUID
 */

module.exports = class GenshinAccount {
  /**
   * @private
   */
  constructor(hoyokit, data) {
    /** @type {HoyoKit} */
    this.hoyokit = hoyokit;

    /** @type {string} */
    this.uid = data.uid;
    /** @type {number} */
    this.daysActive = data.stats.active_day_number;
    /** @type {number} */
    this.achievementCount = data.stats.achievement_number;
    /** @type {number} */
    this.winrate = data.stats.win_rate;
    /** @type {number} */
    this.anemoculi = data.stats.anemoculus_number;
    /** @type {number} */
    this.geoculi = data.stats.geoculus_number;
    /** @type {number} */
    this.electroculi = data.stats.electroculus_number;
    /** @type {number} */
    this.characterCount = data.stats.avatar_number;
    /** @type {number} */
    this.waypointsUnlocked = data.stats.way_point_number;
    /** @type {number} */
    this.domainsUnlocked = data.stats.domain_number;
    /** @type {string} */
    this.abyssFloor = data.stats.spiral_abyss;
    /** @type {number} */
    this.preciousChests = data.stats.precious_chest_number;
    /** @type {number} */
    this.luxuriousChests = data.stats.luxurious_chest_number;
    /** @type {number} */
    this.exquisiteChests = data.stats.exquisite_chest_number;
    /** @type {number} */
    this.commonChests = data.stats.common_chest_number;
    /** @type {number} */
    this.magicChests = data.stats.magic_chest_number;

    /**
     * @typedef {object} regionProgress
     * @property {number} level
     * @property {number} progress
     */
    /**
     * @typedef {object} explorationProgress
     * @property {regionProgress} inazuma
     * @property {regionProgress} liyue
     * @property {regionProgress} mondstadt
     * @property {number} frostbearing
     * @property {number} sakura
     */
    /** @type {explorationProgress} */
    this.exploration = {
      ...Object.fromEntries(data.world_explorations.filter(e=>e.id!=3).map(e=>[e.name.toLowerCase(), {
        level: e.level,
        progress: e.exploration_percentage/10,
      }])),
      frostbearing: data.world_explorations.find(e=>e.id==3).offerings[0].level,
      sakura: data.world_explorations.find(e=>e.id==4).offerings[0].level,
    };

    /** @type {Character[]} */
    this.characters = data.avatars.map(c => new Character(this.hoyokit, c, this));

    /**
     * @typedef {object} teapotData
     * @property {number} level
     * @property {number} visits
     * @property {number} maxEnergy
     * @property {string[]} realms
     */
    /** @type {teapotData} */
    this.teapot = {
      rank: data.homes[0].level,
      visits: data.homes[0].visit_num,
      maxEnergy: data.homes[0].comfort_num,
      realms: data.homes.map(h=>h.name),
    }
  }

  /**
   * Fetches character details for this account
   * @returns {Character}
   */
  async fetchCharacters() {
    const res = await this.hoyokit.request('post', 'https://bbs-api-os.mihoyo.com/game_record/genshin/api/character', { server: utils.server(this.uid), role_id: this.uid, character_ids: this.characters.map(c=>(c.id)) });
    const list = res.data.avatars.map(c => new Character(this, c));
    this.characters = list;
    return list;
  }

  /**
   * Fetches abyss data for this account
   * @param {number} 0: current abyss, 1: previous abyss, defaults to 0 
   * @returns {AbyssData}
   */
  async fetchAbyss(id=0) {
    const res = await this.hoyokit.request('get', 'https://bbs-api-os.mihoyo.com/game_record/genshin/api/spiralAbyss', { server: utils.server(this.uid), role_id: this.uid, schedule_type: id+1 });
    return new AbyssData(this, res.data);
  }
}