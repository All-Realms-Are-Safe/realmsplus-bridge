import { world } from "@minecraft/server";
import { Database } from "./Database.js";

let playerDB, worldDB;

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new Database("playerDB", {});
    worldDB = new Database("worldDB", {
        name: null, // data retrieved by bridge
        settings: {
            cpsLimit: 50, // basically turned off
            chat: {
                separator: "§r§8] [§r", // separator between ranks
                defaultFormat: "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{MESSAGE}",
                customFormat: ""
            }
        },
        modules: {
            chatRanks: false,
            antiAutoClicker: false
        }
    });

    playerDB.init();
    worldDB.init();
});

export { playerDB, worldDB };