const HoyoKit = require('../HoyoKit.js');
const GenshinAccount = require('./GenshinAccount.js');
const Character = require('./Character.js');

module.exports = class Artifact {
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
    this.icon = data.icon;
    /** @type {number} */
    this.position = data.pos-1;
    /** @type {4|5} */
    this.rarity = data.rarity;
    /** @type {number} */
    this.level = data.level;

    /**
     * @typedef {object} artifactSet
     * @property {string} id
     * @property {string} name
     * @property {string} twoPiece
     * @property {string} fourPiece
     */
    /** @type {artifactSet} */
    this.set = {
      id: data.set.id.toString(),
      name: data.set.name,
      twoPiece: data.set.affixes.find(a=>a.activation_number==2).effect,
      fourPiece: data.set.affixes.find(a=>a.activation_number==4).effect,
    }
  }
}