import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { showMainMenu } from "./home.js";
import { worldDB } from "../loader.js";

export function showConfigMenu(player) {
    const form = new ActionFormData()
        .title("§l§2Realms§f+ §0- §eConfig")
        .body("§nSelect an option to configure:")
        .button("§l§aAnti Auto Clicker \n§r§0[ §eChange CPS limit §0]", "textures/gui/newgui/mob_effects/bad_omen_effect")
        .button("§l§nBack", "textures/gui/controls/left")

    let worldData = worldDB.readStorage("worldDB");

    form.show(player).then((r) => {
        if (r.canceled) return;
        switch (r.selection) {
            case 0: 
                autoclickConfig(player, worldData);
                player.playSound("note.bassattack");
                break;
            case 1: 
                showMainMenu(player);
                player.playSound("note.bassattack");
                break;
            default:
                player.playSound("note.bassattack");
                break;
        };
    });
};

function autoclickConfig(player, worldData) {
    const form = new ModalFormData()
        .title("§l§2Realms§f+ §0- §eConfig/§pAuto Clicker")
        .textField("§nEnter CPS Limit", `Current: ${worldData.settings.cpsLimit.toString()}`)
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;
        const newCPSLimit = parseInt(r.formValues[0] || worldData.settings.cpsLimit);
        if (isNaN(newCPSLimit)) {
            player.sendMessage("§cOnly integers are allowed as CPS limit values!");
            player.playSound("note.bassattack");
            return;
        }
        worldDB.writeStorage("worldDB", {
            ...worldData,
            settings: {
                ...worldData.settings,
                cpsLimit: newCPSLimit
            }
        });
        showConfigMenu(player);
        player.playSound("note.bassattack");
    });
};