import { ActionFormData } from "@minecraft/server-ui";
import { showModerationMenu } from "./moderation.js";
import { showModulesMenu } from "./modules.js";

export function showMainMenu(player) {
    const form = new ActionFormData()
        .title("§l§2Realms§f+ §0- §eMain Menu")
        .button("§l§aModeration \n§r§0[ §eManage Players §0]", "textures/ui/hammer_l")
        .button("§l§aModules \n§r§0[ §eToggle modules §0]", "textures/ui/absorption_effect")
        .button("§l§aClose \n§r§0[ §eClose the GUI §0]", "textures/ui/crossout");

    form.show(player).then((r) => {
        if (r.canceled) return;
        switch (r.selection) {
            case 0: 
                showModerationMenu(player);
                player.playSound("vr.stutterturn");
                break;
            case 1: 
                showModulesMenu(player); 
                player.playSound("vr.stutterturn");
                break;
            default: 
                player.playSound("vr.stutterturn");
                break;
        };
    });
};