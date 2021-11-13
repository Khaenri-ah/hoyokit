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

## Usage Example
```js
// this example assumes async is allowed in the current scope
const HoyoKit = require('hoyokit');

// to get your cookies, go to https://webstatic-sea.mihoyo.com/app/community-game-records-sea and input `document.cookie` in your browser's developer console. You need the entire string it returns.
const hoyo = new HoyoKit('YOUR COOKIES GO HERE');

const accounts = await hoyo.accounts('000000');

const genshin = await hoyo.genshin(accounts[0].game_role_id);
console.log(genshin);

const characters = await hoyo.characters(accounts[0].game_role_id);
console.log(characters);
```

## Thanks

[Zyla](https://github.com/Eilyz) and [MRDGH2821](https://github.com/MRDGH2821) for helping figure out how the API works and what extra endpoints we needed.