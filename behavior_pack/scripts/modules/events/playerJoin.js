import { updateModel } from "../utils/players.js";
import { world } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((event) => {
    const player = world.getPlayers().find(p => p.name === event.playerName);
    if (!player) return;
    updateModel(player);
    if (player.name.length > 24 || player.name.includes("§")) {
        world.getDimension("overworld").runCommand(`kick ${player.name} §8[§aRealms§f+§8] §cNamespoof Detected.`);
        return;
    };
});