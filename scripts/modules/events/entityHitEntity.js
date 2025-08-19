import { hasTimerReachedEnd, setTimer, getTime } from "../utils/common.js";
import { Player, world, system } from "@minecraft/server";
import { worldDB, CombatDB } from "../loader.js";

const cpsRecord = new Map();
const duration = 1000;

// Anti Auto Clicker
world.afterEvents.entityHitEntity.subscribe((event) => {
    const { damagingEntity: attacker } = event;
    if (!(attacker instanceof Player)) return;
    if (!worldDB.readStorage("worldDB").modules.antiAutoClicker) return;
    const time = Date.now();
    let entry = cpsRecord.get(attacker.id) || { count: 0, lastUpdate: time };
    if (time - entry.lastUpdate >= duration) {
        entry.count = 0;
        entry.lastUpdate = time;
    };
    entry.count++;
    cpsRecord.set(attacker.id, entry);
    const cps = getPlayerCPS(attacker);
    const worldData = worldDB.readStorage("worldDB");
    if (cps >= worldData.settings.cpsLimit) {
        attacker.runCommand(`kick "${attacker.name}" Auto Clicker Detected.`);
        world.sendMessage(`§8[§aRealms§f+§8] §l>> §r§e${attacker.name} §chas been kicked for Auto Clicker §8(§6${cps}§7 > §e${worldData.settings.cpsLimit}§8)`);
    };
});

// Anti Combat Log
world.afterEvents.entityHurt.subscribe((event) => {
    const attacker = event.damageSource.damagingEntity;
    if (!(attacker instanceof Player)) return;
    const victim = event.hurtEntity;
    
    if (victim instanceof Player) {
        CombatDB[victim.id] = { 
            involvedId: attacker.id,
            incombat: true, 
            timer: setTimer(60, "seconds"),
            clear: false,
            location: victim.location,
            dimension: victim.dimension.id,
            items: getPlayerItems(victim)
        };
    }
    
    if (attacker instanceof Player) {
        CombatDB[attacker.id] = { 
            involvedId: victim.id,
            incombat: true, 
            timer: setTimer(60, "seconds"),
            clear: false,
            location: attacker.location,
            dimension: attacker.dimension.id,
            items: getPlayerItems(attacker)
        };
    }
});

system.runInterval(() => {
    const worldData = worldDB.readStorage("worldDB");
    if (!worldData.modules.antiCombatLog) return;

    world.getPlayers().forEach((player) => {
        const combatData = CombatDB[player.id];
        if (!combatData) return;

        const remainingTime = getTime(combatData.timer).seconds;
        player.onScreenDisplay.setActionBar(`§7Combat:§b ${remainingTime < 0 ? 0 : remainingTime}`);

        if (hasTimerReachedEnd(combatData.timer.targetDate)) {
            delete CombatDB[player.id];
            return;
        }

        CombatDB[player.id] = {
            ...combatData,
            location: player.location,
            dimension: player.dimension.id,
            items: getPlayerItems(player)
        };
    });
}, 20);

world.afterEvents.entityDie.subscribe(({ deadEntity: victim }) => {
    if (victim instanceof Player && CombatDB[victim.id]) {
        const combatData = CombatDB[victim.id];
        delete CombatDB[victim.id];
        delete CombatDB[combatData.involvedId];
    };
});

function getPlayerItems(player) {
    const inventory = player.getComponent("inventory").container;
    const equipment = player.getComponent("minecraft:equippable");
    return [
        ...Array.from({ length: inventory.size })
            .map((_, i) => inventory.getItem(i))
            .filter(item => item !== undefined),
        ...["Head", "Chest", "Legs", "Feet"]
            .map(slot => equipment.getEquipment(slot))
            .filter(item => item !== undefined)
    ];
};

export function getPlayerCPS(player) {
    const entry = cpsRecord.get(player.id);
    if (!entry) return 0;
    const now = Date.now();
    if (now - entry.lastUpdate > duration) return 0;
    return entry.count;
};