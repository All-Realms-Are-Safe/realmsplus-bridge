# Events

These are all **outbound events** sent to Realms+ by the pack

## bridge.outboundEvent(data) 

`data` is an object with the following properties:

**eventId**      | true     | Name of the event thats being sent to the bot
**data**         | false    | Custom data object, this should be values you want the bot to have access to
---

`realmsplus.realmKick` - Kicks a player from the realm memberlist
```js
{
    gamertag: "NoVa Gh0ul"
}
```

`realmsplus.realmBan` - Bans a player from the realm
```js
{
    gamertag: "NoVa Gh0ul",
    duration: 6000 // ms value
}
```

`realmsplus.blockPlaced` - Triggered when a player places a command block down 
```js
{
    username: "NoVa Gh0ul",
    block: "minecraft:command_block",
    location: { x: 0, y: 0, z: 0 },
    dimension: "minecraft:overworld"
}
```

`realmsplus.combatLog` - Triggered when a player leaves the game during combat
```js
{
    victim: "Realms+ v4",
    attacker: "NoVa Gh0ul",
    itemCount: 23 // number of items the victim dropped/got cleared from their inventory
}
```

`realmsplus.playerAFK` - Triggered when a player is afk for too long
```js
{
    username: "NoVa Gh0ul"
}
```

---
## Responses

`realmsplus.configUpdate` - Response to the config update request
```js
{
    message: "Config updated for {WORLD_NAME}" | "Failed to update config for {WORLD_NAME}"
}
```

`realmsplus.lookupPlayer` - Response to the lookupPlayer request
```js
{
    message: player // returns player entry in playerDB if found, otherwise null
}
```