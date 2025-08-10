import { world } from "@minecraft/server";
import { bridge } from "../../main.js";

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const { player, block, dimension } = event;
    if (block.typeId === "minecraft:command_block" || block.typeId === "minecraft:chain_command_block" || block.typeId === "minecraft:repeating_command_block") {
        bridge.outboundEvent({ eventId: "realmsplus.blockPlaced", data: { username: player.name, block: block.typeId, location: block.location, dimension: dimension.id } });
    };
});