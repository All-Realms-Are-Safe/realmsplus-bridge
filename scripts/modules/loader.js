import { world, system } from "@minecraft/server";
import { bridge } from "../main.js";
import { Database } from "./Database.js";

export const CombatDB = {};

let playerDB, worldDB;

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new Database("playerDB", {});
    worldDB = new Database("worldDB", {
        name: null, // data retrieved by bridge
        settings: {
            nametags: {
                defaultFormat: "§f{USERNAME}\n§c ${HEALTH}§r",
                customFormat: ""
            },
            cpsLimit: 50, // anti autoclicker
            chat: {
                separator: "§r§8] [§r", // separator between ranks
                defaultFormat: "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{MESSAGE}",
                customFormat: ""
            },
            combat: { // anti combat log
                interval: 10
            }
        },
        modules: {
            chatRanks: false,
            antiAutoClicker: false,
            antiCombatLog: false
        }
    });

    playerDB.init();
    worldDB.init();

    worldTasks(worldDB);
});

function worldTasks(db) {
    system.runInterval(() => {
        bridge.syncWorld(world);
    }, 200);

    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const health = player.getComponent("minecraft:health");
            player.nameTag = `${player.name}\n§c ${health.currentValue.toFixed(1)}`
        };
    }, 5);
};

export { playerDB, worldDB };