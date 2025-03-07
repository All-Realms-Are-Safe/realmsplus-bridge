# World Integration - Realms+ Bridge

## Overview
**Realms+ Bridge** allows for real time communication between the realm and our automod service. This addon also has built in support for the **NoMoreChatSpam** pack.

## Features
- **Chat Relay** - Syncs in-game chat with external platforms.
- **Anti-Spam** - Detects and mitigates spam messages.
- **Anti Auto Clicker** - Prevents automated clicking exploits.
- **Player Management** - Allows muting and unmuting players.
- **View Player Inventory** - Retrieves and displays player inventory contents.
- **Command Block Logging** - Notifies when and where a command block was placed in your world.

---

## Script Events Sent by the Bot (INBOUND)
### `realmsplus:ready`
Indicates that the bot has successfully joined the game and is ready for communication.

### `realmsplus:configUpdate`
Sends JSON data to update the world database (`worldDB`).

### `realmsplus:lookupPlayer`
Requests a lookup for a specific player in the database and returns their stored model if found.

---

## Tellraw Messages Sent to the Bot (OUTBOUND)
### `eventId: realmsplus.configUpdate`
Confirms that a `configUpdate` request has been processed successfully.

### `eventId: realmsplus.lookupPlayer`
Returns the requested player model data.

### `eventId: realmsplus.blockPlaced`
Sends information about specific block placements (e.g., command blocks). Example payload:
```json
bridge.outboundEvent({
    eventId: "realmsplus.blockPlaced",
    data: {
        username: player.name,
        block: block.typeId,
        location: block.location,
        dimension: dimension.id
    }
});
```

---

## Bridge Class Implementation
The **Bridge** class facilitates communication between the Minecraft world and the external bot. It includes event management, outbound messaging, and world data synchronization.

### Key Components
- **BridgeSignal**: Manages custom event subscriptions and emissions.
- **Bridge Class**:
  - Handles incoming script events.
  - Sends outbound events to the Realms+ bot.
  - Synchronizes stored player models every 10 seconds.

### Example Usage
```javascript
import { world } from "@minecraft/server";
import { bridge } from "./Bridge";

world.beforeEvents.chatSend.subscribe((event) => {
    const { message, sender } = event;
    bridge.outboundEvent({ eventId: "realmsplus.chatSend", data: { message: `${sender.name} said: ${message}` } });
});
```