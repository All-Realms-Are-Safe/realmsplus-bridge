import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { showMainMenu } from "./home.js";
import { worldDB } from "../loader.js";
 
// export function showModulesMenu(player) {
//     let worldData = worldDB.readStorage("worldDB");
//     const form = new ModalFormData()
//         .title("§l§2Realms§f+ §0- §eModules")
//         .toggle("§l§2Chat Ranks", { defaultValue: worldData?.modules?.chatRanks || false, tooltip: "When enabled, this module will add ranks and colors to your chat!" })
//         .toggle("§l§2Anti Auto Clicker", { defaultValue: worldData?.modules?.antiAutoClicker || false, tooltip: "When enabled, this module will detect and kick players who are using an Auto Clicker!" })
//         .submitButton("§l§aSave");

//     form.show(player).then((r) => {
//         if (r.canceled) return;
//         worldDB.writeStorage("worldDB", {
//             ...worldData,
//             modules: {
//                 chatRanks: r.formValues[0] || false,
//                 antiAutoClicker: r.formValues[1] || false
//             }
//         });
//         showMainMenu(player);
//         player.playSound("note.bassattack");
//     });
// };

export function showModulesMenu(player) {
    let worldData = worldDB.readStorage("worldDB");
    const form = new ActionFormData()
        .title("§l§2Realms§f+ §0- §eModules")
        .body("test")
        .button("§l§2Chat Ranks")
        .button("§l§2Anti Auto Clicker")

    form.show(player).then((r) => {
        if (r.canceled) return;
        switch (r.selection) {
            case 0:
                showRanksMenu(player, worldData);
                break;
            case 1:
                break;
        }
    });
};

const tip = 
    "§3Variables§r\n\n" +
    "§7{RANKS} §8- §rThe ranks a user has\n\n" +
    "§7{USERNAME} §8- §rThe player's username\n\n" +
    "§7{MESSAGE} §8- §rThe message the player sent";

function showRanksMenu(player, worldData) {
    const form = new ModalFormData()
        .title("§eModules §0- §bChat Ranks")
        .toggle("§l§2Chat Ranks", { defaultValue: worldData?.modules?.chatRanks || false, tooltip: "When enabled, this module will add ranks and colors to your chat!" })
        .textField(`§2Chat Format`, "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{message}", { defaultValue: worldData?.settings?.chat?.defaultFormat || "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{MESSAGE}", tooltip: tip })
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;
        worldDB.writeStorage("worldDB", {
            ...worldData,
            settings: {
                ...worldData.settings,
                chat: {
                    ...worldData.settings.chat,
                    defaultFormat: r.formValues[1] || "§8[§r{RANKS}§r§8] §7<{USERNAME}> §f{MESSAGE}"
                }
            },
            modules: {
                ...worldData.modules,
                chatRanks: r.formValues[0] || false
            }
        });
        showMainMenu(player);
        player.playSound("note.bassattack");
    });      
};