# Realms+ Bridge - Outbound Events Documentation

## Overview

This document outlines the outbound event system for the Realms+ Bridge integration. Events are transmitted from the Minecraft world to the Realms+ backend service for processing and automation.

## Event Structure

All outbound events utilize the following standardized format:

```js
bridge.outboundEvent({
    eventId: "string",      // Required: Event identifier
    data: {}                // Optional: Event-specific payload data
})
```

## Event Catalog

`realmsplus.realmKick`
Removes a player from the realm member list.

Payload:

```js
{
    gamertag: "NoVa Gh0ul"  // Required: Xbox Live gamertag of player to kick
}
```

`realmsplus.realmBan`
Bans a player from accessing the realm.

Payload:

```js
{
    gamertag: "NoVa Gh0ul",  // Required: Xbox Live gamertag of player to ban
    duration: 6000           // Optional: Ban duration in milliseconds (permanent if omitted)
}
```

`realmsplus.blockPlaced`
Triggers when a player places a command block. Used for monitoring restricted block usage.

Payload:

```javascript
{
    username: "NoVa Gh0ul",                 // Required: In-game username
    block: "minecraft:command_block",       // Required: Block identifier
    location: { x: 0, y: 0, z: 0 },        // Required: World coordinates
    dimension: "minecraft:overworld"        // Required: Dimension identifier
}
```

`realmsplus.combatLog`
Detects and reports players who disconnect during combat situations.

Payload:

```javascript
{
    victim: "Realms+ v4",    // Required: Username of player who disconnected
    attacker: "NoVa Gh0ul",  // Required: Username of combat participant
    itemCount: 23            // Required: Number of items dropped/confiscated
}
```

`realmsplus.playerAFK`
Monitors player activity and detects extended AFK periods.

Payload:

```javascript
{
    username: "NoVa Gh0ul"  // Required: Username of AFK player
}
```


## Response Events

`realmsplus.configUpdate`
Acknowledgement of configuration update requests.

Response Format:

```javascript
{
    message: "Config updated for {WORLD_NAME}"  // Success message
    // OR
    message: "Failed to update config for {WORLD_NAME}"  // Error message
}
```

`realmsplus.lookupPlayer`
Returns player data from the database in response to lookup requests.

Response Format:

```javascript
{
    message: player  // Player database entry object if found, otherwise null
}
```