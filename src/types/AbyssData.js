const HoyoKit = require('../HoyoKit.js');
const GenshinAccount = require('./GenshinAccount.js');
const Character = require('./Character.js');
const utils = require('../utils.js');

class AbyssData {
  /**
   * @private 
   */
   constructor(owner, data) {
     /** @type {GenshinAccount} */
     this.owner = owner;
    /** @type {HoyoKit} */
    this.hoyokit = owner.hoyokit;

    /** @type {string} */
    this.id = data.schedule_id.toString();
    /** @type {number} */
    this.stars = data.total_star;
    /** @type {number} */
    this.startedAt = Number(data.start_time)*1000;
    /** @type {number} */
    this.endedAt = Number(data.end_time)*1000;
    /** @type {number} */
    this.battleCount = data.total_battle_times;
    /** @type {number} */
    this.winCount = data.total_win_times;
    /** @type {number} */
    this.floorCode = data.max_floor;

    /**
     * @typedef {object} characterStats
     * @property {Character} character
     * @property {number} uses
     * @property {number} defeatCount
     * @property {number} damageTaken
     * @property {number} skillUses
     * @property {number} burstUses
     */
    /** @type {characterStats[]} */
    this.characters = data.reveal_rank.map((r,i)=>({
      character: this.owner?.characters.find(c=>c.id==r.avatar_id),
      uses: r.value,
      defeatCount: data.defeat_rank.find(d=>d.avatar_id==r.avatar_id)?.value||0,
      damageTaken: data.take_damage_rank.find(t=>t.avatar_id==r.avatar_id)?.value||0,
      skillUses: data.normal_skill_rank.find(s=>s.avatar_id==r.avatar_id)?.value||0,
      burstUses: data.energy_skill_rank.find(b=>b.avatar_id==r.avatar_id)?.value||0,
    }));

    /**
     * @typedef {object} maxDamage
     * @property {Character} character
     * @property {number} damage
     */
    /** @type {maxDamage} */
    this.maxDamage = {
      character: this.owner?.characters.find(c=>c.id==data.damage_rank[0].avatar_id),
      damage: data.damage_rank[0].value,
    }

    /** @type {AbyssFloor[]} */
    this.floors = data.floors.map(f=>new AbyssFloor(this, f));
  }
}

class AbyssFloor {
  /**
   * @private
   */
  constructor(abyss, data) {
    /** @type {AbyssData} */
    this.abyss = abyss;

    this.raw = data;

    /** @type {number} */
    this.index = data.index;
    /** @type {boolean} */
    this.unlocked = data.is_unlock;
    /** @type {number} */
    this.stars = data.star;

    /** @type {AbyssChamber[]} */
    this.chambers = data.levels.map(l=>new AbyssChamber(this, l));
  }
}

class AbyssChamber {
  /**
   * @private
   */
  constructor(floor, data) {
    /** @type {AbyssFloor} */
    this.floor = floor;

    this.raw = data;

    /** @type {number} */
    this.index = data.index;
    /** @type {number} */
    this.stars = data.stars;

    /**
     * @typedef {object} battle
     * @property {number} index
     * @property {number} attemptedAt
     * @property {Character[]} characters
     */
    /** @type {battle[]} */
    this.battles = data.battles.map(b=>({
      index: b.index,
      attemptedAt: Number(b.timestamp)*1000,
      characters: b.avatars.map(a=>this.floor.abyss.owner?.characters.find(c=>c.id==a.id)),
    }));
  }
}

module.exports = AbyssData;