import { ModalFormData } from "@minecraft/server-ui";
import { showMainMenu } from "./home.js";
import { worldDB } from "../loader.js";
 
export function showModulesMenu(player) {
    const form = new ModalFormData()
        .title("§l§2Realms§f+ §0- §eModules")
        .toggle("§l§2Chat Ranks", worldDB.readStorage("worldDB").modules.chatRanks)
        .toggle("§l§2Anti Auto Clicker", worldDB.readStorage("worldDB").modules.antiAutoClicker)
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;
        let worldData = worldDB.readStorage("worldDB");
        worldDB.writeStorage("worldDB", {
            ...worldData,
            modules: {
                chatRanks: r.formValues[0] || false,
                antiAutoClicker: r.formValues[1] || false
            }
        });
        showMainMenu(player);
        player.playSound("note.bassattack");
    });
};