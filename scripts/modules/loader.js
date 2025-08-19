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
                defaultFormat: "§f{USERNAME}\n§c {HEALTH}§r",
                customFormat: ""
            },
            cpsLimit: 50, // anti autoclicker
            chat: {
                separator: "§r§8] [§r", // separator between ranks
                defaultFormat: "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{MESSAGE}",
                customFormat: ""
            },
            combat: { // anti combat log
                interval: 10,
                defaultMessage: "§cYou've been VERY bad and as a result you lost EVERY item in your inventory when you left >:(", // sent to players who clogged and rejoined
                customMessage: ""
            }
        },
        modules: {
            customNametags: true,
            chatRanks: false,
            antiAutoClicker: false,
            antiCombatLog: false
        }
    });

    playerDB.init();
    worldDB.init();

    system.runTimeout(() => { worldTasks(worldDB); }, 40);
});

function worldTasks(db) {
    // Sync WorldDB
    system.runInterval(() => {
        bridge.syncWorld(world);
    }, 200);

    // Display Custom Nametags
    system.runInterval(() => {
        const worldData = db.readStorage("worldDB");

        const format = worldData.settings.nametags.customFormat || worldData?.settings?.nametags?.defaultFormat;
        
        for (const player of world.getPlayers()) {
            const health = player.getComponent("minecraft:health");
            const final = format.replaceAll(/\{(.+?)\}/gi, (_, key) => {
                switch (key.toLowerCase()) {
                    case "username":
                        return player.name;
                    case "health":
                        return health.currentValue.toFixed(1);
                    default:
                        return "";
                }
            });
            if (worldData.modules.customNametags) {
                player.nameTag = final;
            } else {
                player.nameTag = player.name;
            }
        };
    }, 5);
};

export { playerDB, worldDB };