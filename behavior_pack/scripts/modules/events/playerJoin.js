import { updateModel } from "../utils/players.js";
import { world } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((event) => {
    const player = world.getPlayers().find(p => p.name === event.playerName);
    if (!player) return;
    updateModel(player);
});