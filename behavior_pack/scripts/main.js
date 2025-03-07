import { world, system } from "@minecraft/server";
import Bridge from "./modules/Bridge.js";
const bridge = new Bridge();
export { bridge };

system.runInterval(() => {
    bridge.syncWorld(world);
}, 200);

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});

// -----------------------------------------------------------------
//                             Startup
// -----------------------------------------------------------------
import "./modules/loader.js";
// import "./managers/CommandManager.js";

// -----------------------------------------------------------------
//                             Events
// -----------------------------------------------------------------
// Chat Ranks + Moderation
import "./modules/events/chatSend.js";
// Storing Player Data
import "./modules/events/playerJoin.js";
// GUI Trigger
import "./modules/events/itemUse.js";
// Anti Auto Clicker
import "./modules/events/entityHitEntity.js";
// Player Place Block
import "./modules/events/playerPlaceBlock.js";