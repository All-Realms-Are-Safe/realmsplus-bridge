import { ModalFormData } from "@minecraft/server-ui";
import { showMainMenu } from "./home.js";
import { worldDB } from "../loader.js";
 
export function showModulesMenu(player) {
    let worldData = worldDB.readStorage("worldDB");
    const form = new ModalFormData()
        .title("§l§2Realms§f+ §0- §eModules")
        .toggle("§l§2Chat Ranks", worldData?.modules?.chatRanks || false)
        .toggle("§l§2Display Health", worldData?.modules?.displayHealth || false)
        .toggle("§l§2Anti Auto Clicker", worldData?.modules?.antiAutoClicker || false)
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;
        worldDB.writeStorage("worldDB", {
            ...worldData,
            modules: {
                chatRanks: r.formValues[0] || false,
                displayHealth: r.formValues[1] || false,
                antiAutoClicker: r.formValues[1] || false
            }
        });
        showMainMenu(player);
        player.playSound("note.bassattack");
    });
};