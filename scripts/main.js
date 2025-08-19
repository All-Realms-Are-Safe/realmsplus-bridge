import { world, system } from "@minecraft/server";
import Bridge from "./modules/Bridge.js";
const bridge = new Bridge();
export { bridge };

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});

// -----------------------------------------------------------------
//                             Startup
// -----------------------------------------------------------------
import "./modules/loader.js";

// -----------------------------------------------------------------
//                             Events
// -----------------------------------------------------------------
// Chat Ranks + Moderation
import "./modules/events/chatSend.js";
// GUI Trigger
import "./modules/events/itemUse.js";
// Anti Auto Clicker
import "./modules/events/entityHitEntity.js";
// Player Place Block
import "./modules/events/playerPlaceBlock.js";
// Anti Combat Log
import "./modules/events/playerLeave.js";
import "./modules/events/playerSpawn.js"; // Also updates player model