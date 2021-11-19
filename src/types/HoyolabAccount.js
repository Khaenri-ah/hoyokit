const HoyoKit = require('../HoyoKit.js');
const GameAccount = require('./GameAccount.js');
const utils = require('../utils.js');

/**
 * A hoyolab UID
 * @typedef {(number|string)} HoyolabUID
 */
/**
 * A genshin UID
 * @typedef {(number|string)} GenshinUID
 */

module.exports = class HoyolabAccount {
  /**
   * @private
   */
  constructor(hoyokit, data) {
    /** @type {HoyoKit} */
    this.hoyokit = hoyokit;

    const user = data.user_info;
    /** @type {HoyolabUID} */
    this.uid = user.uid;
    /** @type {string} */
    this.name = user.nickname;
    /** @type {string} */
    this.bio = user.introduce;
    /** @type {string} */
    this.avatarId = user.avatar;
    /** @type {string} */
    this.avatarUrl = user.avatar_url;
    /** 
     * - 0: prefer not to say
     * - 1: male
     * - 2: female
     * - 3: other
     * @typedef {0|1|2|3} gender
     */
    /** @type {gender} */
    this.gender = user.gender;
    /** @type {number} */
    this.level = user.level.level;
    /** @type {number} */
    this.levelColor = parseInt(user.level.bg_color.slice(1), 16);
    /** @type {string} */
    this.levelBadge = user.level.bg_image;
    /** @type {number} */
    this.xp = user.level.exp;
    if (user.pendant) {
      /** @type {string} */
      this.avatarBorder = user.pendant;
    }
    if (user.certification.type) {
      /** @type {string} */
      this.title = user.certification.label;
    };

    /**
     * @typedef {object} Level
     * @property {number} level
     * @property {number} exp
     * @property {number} game_id
     */
    /** @type {Level[]} */
    this.levelXp = user.level_exps;

    /** @type {number} */
    this.followerCount = Number(user.achieve.followed_cnt);
    /** @type {number} */
    this.followingCount = Number(user.achieve.follow_cnt);
    /** @type {number} */
    this.likeCount = Number(user.achieve.like_num);
    /** @type {number} */
    this.postCount = Number(user.achieve.post_num);
    /** @type {number} */
    this.replyCount = Number(user.achieve.replypost_num);
    /** @type {number} */
    this.topicCount = Number(user.achieve.topic_cnt);
    /** @type {number} */
    this.goodPostCount = Number(user.achieve.good_post_num);

    /**
     * - 1<<0: hide posts from profile
     * - 1<<1: hide favorites from profile
     * - 1<<2: add watermark to images
     * - 1<<3: hide battle chronicle
     * - 1<<4: hide following
     * - 1<<5: hide followers
     * @typedef {number} privacySettings
     */
    /** @type {privacySettings} */
    this.privacySettings = utils.objectBits(user.community_info.privacy_invisible);
    /**
     * disable notifications for:
     * - 1<<0: replies
     * - 1<<1: likes
     * - 1<<2: followers
     * - 1<<3: system
     * @typedef {number} notificationSettings
     */
    /** @type {notificationSettings} */
    this.notificationSettings = utils.objectBits(user.community_info.notify_disable);
  }

  /**
   * 
   * @param {0|1|2} full 
   * @returns {GameAccount[]}
   */
  async fetchGameAccounts(full=0) {
    const res = await this.hoyokit.request('get', 'https://bbs-api-os.mihoyo.com/game_record/card/wapi/getGameRecordCard', { uid: this.uid });
    const list = await Promise.all(res.data.list.map(async (a) => {
      const acc = new GameAccount(this, a);
      if (full&&acc.game==2) await acc.fetchGenshinAccount(full>1);
      return acc;
    }));
    this.gameAccounts = list;
    return list;
  }
}