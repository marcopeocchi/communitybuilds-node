# Genshin Community Builds node API

![logo](https://i.ibb.co/Q9M7kjd/logo.png)

[![NPM](https://nodei.co/npm/communitybuilds-node.png)](https://npmjs.org/package/communitybuilds-node)

Straightforward NodeJS wrapper / API to perform data fetching from [Genshin Impact Helper Team's spreadsheet](https://docs.google.com/spreadsheets/d/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI).

## Usage

```shell
npm i communitybuilds-node
```

```javascript
const { inspect } = require("util")
const { CommunityBuilds } = require("communitybuilds-node")

// you must init the package with a google-console apikey
CommunityBuilds.init("your-api-key")

// promise based example
CommunityBuilds.pyro()
    .then(res => {
        const [amber] = res.data.filter(character => character.name === "amber")
        console.log(inspect(amber, { depth: null }))
    })

// async context example
async function cryoBuilds(){
    const { data } = await CommunityBuilds.cryo()
    console.log(data)
}

async function artifacts(){
    const { data } = await CommunityBuilds.artifacts()
    console.log(data)
}
```

First example will output
```javascript
{
  name: 'amber',
  builds: [
    {
      role: 'dps',
      equipment: [
        "Amos' Bow",
        'Thundering Pulse',
        'Aqua Simulacra',
        'Skyward Harp',
        'Prototype Crescent *',
        "Sharpshooter's Oath (3✩) [R5]",
        'Windblume Ode  [R5]',
        'Blackcliff Warbow',
        'Polar Star',
        'Hamayumi *'
      ],
      artifacts: [
        "Wanderer's Troupe (4)",
        "Shimenawa's Reminiscence (4)",
        'Crimson Witch of Flames (4)',
        "Crimson Witch of Flames (2) Wanderer's Troupe (2)",
        'Crimson Witch of Flames (2) +18% ATK set (2)',
        '+18% ATK set (2) / +18% ATK set (2)'
      ],
      artifactsSubStats: [
        'Crit DMG',
        'ATK%',
        'Elemental Mastery',
        'Energy Recharge',
        'Flat ATK'
      ],
      artifactsMainStats: {
        sands: 'ATK% / Elemental Mastery',
        goblet: 'Pyro DMG',
        circlet: 'Crit DMG'
      },
      talentPriority: [ 'Normal Attack', 'Burst', 'Skill' ],
      optimal: false,
    },
    {
      role: 'support',
      equipment: [
        'Elegy for the End',
        'Favonius Warbow',
        'Sacrificial Bow',
        'Viridescent Hunt'
      ],
      artifacts: [
        'Noblesse Oblige (4)',
        'Instructor (4) *',
        '2x +20% Energy Recharge%',
        'The Exile (4)'
      ],
      artifactsSubStats: [
        'Energy Recharge',
        'Crit Rate / DMG',
        'ATK%',
        'Elemental Mastery',
        'Flat ATK'
      ],
      artifactsMainStats: {
        sands: 'Energy Recharge / ATK%',
        goblet: 'Pyro DMG',
        circlet: 'Crit Rate / DMG'
      },
      talentPriority: [ 'Burst', 'Skill' ],
      optimal: true,
    }
  ]
}
```

Bows retrieval example
```js
const { inspect } = require("util")
const { CommunityBuilds } = require("communitybuilds-node")

(async () => {
  const { data } = await CommunityBuilds.bows()
  console.log(inspect(data, { depth: null }))
})()
```

Will output
```js
[
  {
    name: 'Skyward Harp',
    img: 'https://lh5.googleusercontent.com/IP6wRp9LrejOdFhiouHF8KLAQkrlvWjlHpYdAHkpeHhxfRLUjg89Zh4jiXxG_Gmp62QSKyuvhvObAaqrYuhk6fBHUXLxo7gqVRBdh6BFNXHWy9yzfIsxBXa-uEoS19vDce5i-yuMLgi3XTeZ30ex3j_qscZRcMtSffQaWFLm_5oTvnKLeA8=w217-h99',
    mainStat: { baseATKlv1: 48, baseATKlv90: 674 },
    subStat: { type: 'Crit Rate %', valueLv1: 4.8, valueLv90: 22.1 },
    passiveEffect: 'Increases CRIT DMG by 20/25/30/35/40%. Hits have a 60/70/80/90/100% chance to inflict a small AoE attack, dealing 125% Physical ATK DMG. Can only occur once every 4/3.5/3/2.5/2s.'
  },
  // ... SKIP SOME ENTRIES OTHERWISE IT WILL PRETTY LONG  ... //
  {
    name: 'Fading Twilight',
    img: 'https://lh3.googleusercontent.com/gsDoY6DWoUo4rPud_TydYoUTmqMU67-o5ks7cnL7CEFYNu25S2R9VT7IRl-j_Tw4-ZLQHxnmKR3L73UHhrO39_ZZ_EQjuDKn6WskAbUJjn799MbHIDnNi-vz05lGiqu6uDryhw0easpAyO8P-u-5uwKCn9nIxnugWvjPz6yQqWSsLIxC-eY=w217-h129',
    mainStat: { baseATKlv1: 44, baseATKlv90: 565 },
    subStat: { type: 'ER %', valueLv1: 6.7, valueLv90: 30.6 },
    passiveEffect: 'Has three states, Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by (6/10/14)/(7.5/12.5/17.5)/(9/15/21)/(10.5/17.5/24.5)(12/20/28)% respectively. When attacks hit opponents, this weapon will switch to the next state. This weapon can change states once every 7s. The character equipping this weapon can still trigger the state switch while not on the field.'
  }
]

```

## API keys

In order to properly function this package needs a google-console api key that you can obtain freely from [here](https://console.cloud.google.com/apis/credentials). Create a new project then request a new API key. Beware of the 300 req/min limit. An LRU cache has been added to avoir reaching prematurely the limit.

## Available methods

```javascript
CommunityBuilds.init()      // init API
CommunityBuilds.pyro()      // fetch pyro builds
CommunityBuilds.hydro()     // fetch hydro builds
CommunityBuilds.anemo()     // fetch anemo builds
CommunityBuilds.electro()   // fetch electro builds
CommunityBuilds.dendro()    // fetch dendro build
CommunityBuilds.cryo()      // fetch cryo builds
CommunityBuilds.geo()       // fetch geo builds
CommunityBuilds.all()       // return iterable of all elements

CommunityBuilds.claymores()
CommunityBuilds.swords()
CommunityBuilds.catalysts()
CommunityBuilds.polearms()
CommunityBuilds.bows()

CommunityBuilds.artifacts() 
```

## Notes
Fetching artifacts and weapons does NOT require a google API key, only fetching builds requires it.

## Technical notes
As mentioned before an LRU cache is implemented. This means that the first fetch is in the order of 300-400ms (depending on your hardware), subsequents fetches stands in the order of 0.01-1ms (depending on your hardware).  
This is extremely useful if you planning to do recurring fetches or updating DBs.  
The cache's TTL is 1 minute for both characters build and artifacts/weapons, though it might be increased in the future (after analyzing data of everyday uses).  
Apparently Google Docs bumps classnames by 1 upon every build. Let me explain: classname "s79" becomes "s80. This is an absolute mess,
especially for the scraping method.  
Any help is appriciated.

```javascript
// test taken on M1 mac mini

console.time()
await CommunityBuilds.artifacts()
console.timeEnd()

// default: 2.103s

// subsequent call ->
console.time()
await CommunityBuilds.artifacts()
console.timeEnd()

// default: 0.01ms
```


## Credits
Credits to the [original owners and contributors](https://docs.google.com/spreadsheets/d/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI/htmlview?pru=AAABdXYM80o*xMxXJdNbCCZ-v9FLVh6EXg#).
