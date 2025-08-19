import { world } from "@minecraft/server";
import { CombatDB } from "../loader";

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    const combatData = CombatDB[playerId];
    if (!combatData || combatData.clear) return;

    // If the player left while the entry exists, we spawn their items on the ground and clear their inventory upon rejoining
    combatData.clear = true;
    const dimension = world.getDimension(combatData.dimension);
    combatData.items.forEach(item => {
        if (item) dimension.spawnItem(item, combatData.location);
    });

    // If the victim left, the attacker is no longer in combat
    const attackerData = CombatDB[combatData.involvedId];
    if (attackerData) delete CombatDB[combatData.involvedId];
});