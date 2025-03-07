import { Database } from "./Database.js";

const playerDB = new Database("playerDB", {});
const worldDB = new Database("worldDB", {
    name: null,
    settings: {
        cpsLimit: 50
    },
    modules: {
        chatRanks: false,
        antiAutoClicker: false
    }
});

const config = {
    SCORES: {
        spam: "spam"
    }
};

playerDB.init();
worldDB.init();

export {
    playerDB,
    worldDB,
    config
};