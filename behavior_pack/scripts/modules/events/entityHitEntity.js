import { Player, world } from "@minecraft/server";
import { worldDB } from "../loader.js";

const cpsRecord = new Map();
const duration = 1000;

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

export function getPlayerCPS(player) {
    const entry = cpsRecord.get(player.id);
    if (!entry) return 0;
    const now = Date.now();
    if (now - entry.lastUpdate > duration) return 0;
    return entry.count;
};