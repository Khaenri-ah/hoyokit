const HoyoKit = require('../HoyoKit.js');
const GenshinAccount = require('./GenshinAccount.js');
const Weapon = require('./Weapon.js');
const Artifact = require('./Artifact.js');
const utils = require('../utils.js');

module.exports = class Character {
  /**
   * @private 
   */
  constructor(owner, data) {
    /** @type {GenshinAccount} */
    this.owner = owner;
    /** @type {HoyoKit} */
    this.hoyokit = owner.hoyokit;

    /** @type {string} */
    this.id = data.id.toString();
    /** @type {string} */
    this.name = data.name;
    /** @type {4|5} */
    this.rarity = data.rarity;
    /** @type {string} */
    this.icon = data.image;
    /**
     * - 0: Anemo
     * - 1: Cryo
     * - 2: Dendro
     * - 3: Electro
     * - 4: Geo
     * - 5: Hydro
     * - 6: Pyro
     * @typedef {0|1|2|3|4|5|6} element
     */
    /** @type {element} */
    this.element = utils.element(data.element);
    /** @type {number} */
    this.level = data.level;
    /** @type {number} */
    this.friendship = data.fetter;
    /** @type {number} */
    this.constellationCount = data.actived_constellation_num;

    if (data.weapon) {
      /** @type {Weapon} */
      this.weapon = new Weapon(this.hoyokit, data.weapon, this);
      /** @type {Artifact[]} */
      this.artifacts = data.reliquaries.map(r=>new Artifact(this.hoyokit, r));
      /**
       * @typedef {object} costume
       * @property {string} id
       * @property {string} name
       * @property {string} icon
       */
      /** @type {costume[]} */
      this.costumes = data.costumes.map(c=>({ ...c, id: c.id.toString() }));
    }
  }
}