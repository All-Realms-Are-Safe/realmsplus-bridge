import { world, system } from "@minecraft/server";
import { CombatDB } from "../loader";
import { updateModel } from "../utils/players";

world.afterEvents.playerSpawn.subscribe(({ player }) => {
    const combatData = CombatDB[player.id];
    if (!combatData || !combatData.clear) return;

    player.runCommand("clear @s");
    player.sendMessage("§cYou've been VERY bad and as a result you lost EVERY item in your inventory when you left >:(");
    delete CombatDB[player.id];

    const currentLocation = player.location;
    const newLocation = {
        x: currentLocation.x + 1,
        y: currentLocation.y + -400,
        z: currentLocation.z + 1
    };

    player.runCommand(`teleport @s ${newLocation.x} ${newLocation.y} ${newLocation.z}`);
});