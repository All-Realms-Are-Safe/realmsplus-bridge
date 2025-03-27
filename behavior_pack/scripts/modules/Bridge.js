import { World, world, system } from "@minecraft/server";
import { playerDB, worldDB } from "./loader.js";
import { updateModel } from "./utils/players";

/**
 * World <-> Client communication
 * - Syncs stored player models every 10 seconds
 * - Sends/Receives events
 */
export default class Bridge {
    // -----------------------------------------------------------------
    //                             Inbound Events
    // -----------------------------------------------------------------
    constructor() {
        this._tag = "realmsplus";
        system.afterEvents.scriptEventReceive.subscribe(async (event) => {
            try {
                const payload = JSON.parse(event.message);
                switch(event.id) {
                    case "realmsplus:configUpdate":
                        await worldDB.writeStorage("worldDB", payload?.data);
                        this.outboundEvent({
                            event: "realmsplus:configUpdate", 
                            eventId: payload?.eventId, 
                            data: { 
                                message: `Config updated for ${payload?.data.name}` 
                            } 
                        });
                        break;
                    case "realmsplus:lookupPlayer":
                        const eventId = payload?.eventId;
                        const playerName = payload?.data?.playerName;
                        const player = world.getAllPlayers().find(p => p.name === playerName);
                        const playerData = await playerDB.readStorage("playerDB");
                        this.outboundEvent({ 
                            event: "realmsplus:lookupPlayer",
                            event: eventId,
                            data: {
                                message: player ? playerData[player.id] : null 
                            }
                        });
                        break;
                    default:
                        console.error(`[BridgeError]: Unknown event: ${payload?.event}`);
                        break;
                };
            } catch (e) { console.error(e) };
        });
    };

    // -----------------------------------------------------------------
    //                             World Sync
    // -----------------------------------------------------------------

    /**
     * Sync stored database models on the world
     * @param {World} world - The world class
     */
    async syncWorld() {
        world.getAllPlayers().forEach(async (player) => {
            updateModel(player);
        });
    };
    

    // -----------------------------------------------------------------
    //                             Outbound Event
    // -----------------------------------------------------------------

    /**
     * Sends an outbound event to Realms+
     * 
     * @param {object} packet - The JSON event data to send
     */
    async outboundEvent(packet) {
        const cleanedPacket = JSON.stringify(packet).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        world.getDimension("overworld").runCommand(`tellraw @a[tag=${this._tag}] {"rawtext":[{"text":"${cleanedPacket}"}]}`)
        .catch((e) => {  });
    };
};