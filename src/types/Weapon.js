const HoyoKit = require('../HoyoKit.js');
const GenshinAccount = require('./GenshinAccount.js');
const Character = require('./Character.js');
const utils = require('../utils.js');

module.exports = class Weapon {
  /**
   * @private
   */
  constructor(character, data) {
    /** @type {Character} */
    this.character = character;
    /** @type {GenshinAccount} */
    this.owner = character.owner;
    /** @type {HoyoKit} */
    this.hoyokit = character.hoyokit;

    /** @type {string} */
    this.id = data.id.toString();
    /** @type {string} */
    this.name = data.name;
    /** @type {string} */
    this.description = data.desc;
    /** @type {string} */
    this.icon = data.icon;
    /**
     * - 0: sword
     * - 1: catalyst
     * - 2: claymore
     * - 3: bow
     * - 4: polearm
     * @typedef {0|1|2|3|4} weaponType
     */
    /** @type {weaponType} */
    this.type = utils.weaponType(data.type);
    /** @type {4|5} */
    this.rarity = data.rarity;
    /** @type {number} */
    this.level = data.level;
    /** @type {number} */
    this.ascension = data.promote_level;
    /** @type {number} */
    this.refinement = data.affix_level;    
  }
}