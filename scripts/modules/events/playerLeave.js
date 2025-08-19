import { world } from "@minecraft/server";
import { CombatDB } from "../loader";
import { bridge } from "../../main";

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    const players = world.getPlayers();
    const victim = players.find(player => player.id === playerId);
    const combatData = CombatDB[playerId];
    if (!combatData || combatData.clear) return;
    const attacker = players.find(player => player.id === combatData.involvedId);

    // If the player left while the entry exists, we spawn their items on the ground and clear their inventory upon rejoining
    combatData.clear = true;
    const dimension = world.getDimension(combatData.dimension);
    combatData.items.forEach(item => {
        if (item) dimension.spawnItem(item, combatData.location);
    });

    // If the victim left, the attacker is no longer in combat
    const attackerData = CombatDB[combatData.involvedId];
    if (attackerData) delete CombatDB[combatData.involvedId];

    // Notify bot
    bridge.outboundEvent({
        eventId: "realmsplus.combatLog",
        data: {
            victim: victim.name,
            attacker: attacker.name,
            itemCount: combatData.items.length
        }
    });
});