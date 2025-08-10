import { world } from "@minecraft/server";
import { Database } from "./Database.js";

let playerDB, worldDB;

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new Database("playerDB", {});
    worldDB = new Database("worldDB", {
        name: null,
        settings: {
            cpsLimit: 50
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