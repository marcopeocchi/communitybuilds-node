# Genshin Community Builds node API

![logo](https://i.ibb.co/Q9M7kjd/logo.png)

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
        "Sharpshooter's Oath [R5]",
        'Windblume Ode [R5]',
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
      optimal: false
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
      optimal: true
    }
  ],
  notes: ''
}
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

## Credits
Credits to the [original owners and contributors](https://docs.google.com/spreadsheets/d/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI/htmlview?pru=AAABdXYM80o*xMxXJdNbCCZ-v9FLVh6EXg#).
