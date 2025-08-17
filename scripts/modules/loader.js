import { world } from "@minecraft/server";
import { Database } from "./Database.js";

let playerDB, worldDB;

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new Database("playerDB", {});
    worldDB = new Database("worldDB", {
        name: null,
        settings: {
            cpsLimit: 50,
            chat: {
                separator: "§r§8] [§r",
                defaultFormat: "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{message}",
                customFormat: ""
            }
        },
        modules: {
            chatRanks: false,
            antiAutoClicker: false
        }
    });

    world.sendMessage(JSON.stringify(worldDB.readStorage("worldDB")))

    playerDB.init();
    worldDB.init();
});

export { playerDB, worldDB };