# HoyoKit

A partial rewrite of [@genshin-kit/core](https://www.npmjs.com/package/@genshin-kit/core)

features:
- uses the new API urls
- adds two methods for fetching data by MiHoYo account UID instead of Genshin traveler UID
- it's a lot smaller

## Installation

```bash
npm i hoyokit
```

## Usage

### Initialization
```js
const HoyoKit = require('hoyokit');
const hoyo = new HoyoKit('YOUR COOKIES GO HERE');
```
to get your cookies, go to https://webstatic-sea.mihoyo.com/app/community-game-records-sea and input `document.cookie` in your browser's developer console. You need the entire string it returns.

### MiHoYo account details
account info for a MiHoYo account
```js
const data = await hoyo.getUserInfo('mihoyo uid');
```

### Genshin account list
a list of all the Genshin accounts linked to a MiHoYo account
```js
const data = await hoyo.getCharacterList('mihoyo uid');
```

### Genshin account details
account info for a Genshin account
```js
const data = await hoyo.getCharacterInfo('genshin uid');
```

### spiral abyss stats
spiral abyss stats for a Genshin account
```js
// 1: current abyss, 2: previous abyss, etc 
const data = await hoyo.getAbyssInfo('genshin uid', 1);
```

### full Character stats
full stats on all the characters of a Genshin account
```js
const data = await hoyo.getFullCharacterInfo('genshin uid');