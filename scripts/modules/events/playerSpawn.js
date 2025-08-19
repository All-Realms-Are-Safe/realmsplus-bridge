import { world, system } from "@minecraft/server";
import { CombatDB, worldDB } from "../loader";
import { updateModel } from "../utils/players";

world.afterEvents.playerSpawn.subscribe(({ player }) => {
    const combatData = CombatDB[player.id];
    if (!combatData || !combatData.clear) return;

    const worldData = worldDB.readStorage("worldDB");
    const message = worldData.settings.combat.customMessage || worldData.settings.combat.defaultMessage;

    player.runCommand("clear @s");
    player.sendMessage(message);
    delete CombatDB[player.id];

    const currentLocation = player.location;
    const newLocation = {
        x: currentLocation.x + 1,
        y: currentLocation.y + -400,
        z: currentLocation.z + 1
    };

    player.runCommand(`teleport @s ${newLocation.x} ${newLocation.y} ${newLocation.z}`);
});