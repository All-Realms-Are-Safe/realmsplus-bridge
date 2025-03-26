import { World, world, system } from "@minecraft/server";
import { playerDB, worldDB } from "./loader.js";
import { updateModel } from "./utils/players";

/**
 * World <-> Client communication
 * - Syncs stored player models every 10 seconds
 * - Sends/Receives events
 */
export default class Bridge {
    constructor() {
        this._tag = "realmsplus";
        // Receives inbound events from Realms+
        system.afterEvents.scriptEventReceive.subscribe(async (event) => {
            switch (event.id) {
                case "realmsplus:configUpdate":
                    const data = JSON.parse(event.message);
                    worldDB.writeStorage("worldDB", data);
                    this.outboundEvent({ eventId: "realmsplus.configUpdate", data: { message: `config updated for ${data.name}` } });
                    break;
                case "realmsplus:lookupPlayer":
                    const playerName = event.message.replace(/"/g, "");
                    const player = world.getAllPlayers().find(p => p.name === playerName);
                    const playerData = await playerDB.readStorage("playerDB");
                    this.outboundEvent({ eventId: "realmsplus.lookupPlayer", data: { message: playerData[player.id] } });
                    break;
            };
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