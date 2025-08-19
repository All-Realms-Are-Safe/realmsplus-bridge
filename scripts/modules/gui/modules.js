import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { showMainMenu } from "./home.js";
import { worldDB } from "../loader.js";

export function showModulesMenu(player) {
    let worldData = worldDB.readStorage("worldDB");
    const form = new ActionFormData()
        .title("§l§2Realms§f+ §0- §eModules")
        .button("§l§2Chat Ranks", "textures/ui/chat_send")
        .button("§l§2Nametags", "textures/items/name_tag")
        .button("§l§2Anti Auto Clicker", "textures/gui/newgui/mob_effects/bad_omen_effect")
        .button("§l§vBack", "textures/gui/controls/left");

    form.show(player).then((r) => {
        if (r.canceled) return;
        switch (r.selection) {
            case 0:
                showRanksMenu(player, worldData);
                player.playSound("vr.stutterturn");
                break;
            case 1:
                showNametagsMenu(player, worldData);
                player.playSound("vr.stutterturn");
                break;
            case 2:
                showAntiAutoclickerMenu(player, worldData);
                player.playSound("vr.stutterturn");
                break;
            case 3:
                showMainMenu(player);
                player.playSound("vr.stutterturn");
                break;
            case 4:
                showAntiCombatLogMenu(player, worldData);
                break;
        }
    });
};

function showRanksMenu(player, worldData) {
    const tip1 = "This is used to customize the appearance of the separators between ranks in your chat!";

    const tip2 = 
        "§3Variables§r\n\n" +
        "§7{RANKS} §8- §rranks a user has\n" +
        "§7{USERNAME} §8- §rplayer's username\n" +
        "§7{MESSAGE} §8- §rmessage the player sent";

    const format = worldData.settings.chat.customFormat || worldData?.settings?.chat?.defaultFormat;
    const separator = worldData.settings.chat.separator;

    const form = new ModalFormData()
        .title("§e§lModules §0- §bChat Ranks")
        .toggle("§l§2Chat Ranks", { defaultValue: worldData?.modules?.chatRanks || false, tooltip: "When enabled, this module will add ranks and colors to your chat!" })
        .textField("§2Rank Separator", separator, { defaultValue: separator, tooltip: tip1 })
        .textField("§2Chat Format", format, { defaultValue: format, tooltip: tip2 })
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;

        worldData.modules.chatRanks = r.formValues[0] || false;
        worldData.settings.chat.separator = r.formValues[1] || "§r§8] [§r";
        worldData.settings.chat.customFormat = r.formValues[2];

        worldDB.writeStorage("worldDB", worldData);
        showMainMenu(player);
        player.playSound("vr.stutterturn");
    });
};

function showNametagsMenu(player, worldData) {
    const format = worldData.settings.nametags.customFormat || worldData?.settings?.nametags?.defaultFormat;
    
    const tip1 = "When enabled, this module will display custom nametags above player heads!";
    const tip2 = 
        "§3Variables§r\n\n" +
        "§7{USERNAME} §8- §rplayer's username\n" +
        "§7{HEALTH} §8- §rplayer's health";

    const form = new ModalFormData()
        .title("§e§lModules §0- §bNametags")
        .toggle("§l§2Nametags", { defaultValue: worldData.modules.customNametags || false, tooltip: tip1 })
        .textField("§2Nametag Format", format, { defaultValue: format, tooltip: tip2 })

    form.show(player).then((r) => {
        if (r.canceled) return;

        worldData.modules.customNametags = r.formValues[0] || false;
        worldData.settings.nametags.customFormat = r.formValues[1] || "";

        worldDB.writeStorage("worldDB", worldData);
        showMainMenu(player);
        player.playSound("vr.stutterturn");
    });
};

function showAntiAutoclickerMenu(player, worldData) {
    const tip1 = "When enabled, this module will prevent players from using auto clickers.";
    const tip2 = "This value will determine the maximum amount of clicks per second allowed without punishment.";

    const cpsLimit = worldData.settings.cpsLimit.toString();

    const form = new ModalFormData()
        .title("§e§lModules §0- §bAnti Auto Clicker")
        .toggle("§l§2Anti Auto Clicker", { defaultValue: worldData?.modules?.antiAutoClicker || false, tooltip: tip1 })
        .textField("§2CPS Limit", cpsLimit, { defaultValue: cpsLimit, tooltip: tip2 })
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;

        const [moduleState, limit] = r.formValues;

        worldData.modules.antiAutoClicker = moduleState || false;

        if (isNaN(parseInt(limit))) {
            player.sendMessage("§cOnly integers are allowed as CPS limit values!");
            player.playSound("note.bassattack");
            return;
        };

        if (limit < 1) {
            player.sendMessage("§cCPS limit must be at least 1!");
            player.playSound("note.bassattack");
            return;
        };

        if (limit.length > 3) {
            player.sendMessage("§cCPS limit must be less than 1000!");
            player.playSound("note.bassattack");
            return;
        };

        worldData.settings.cpsLimit = parseInt(limit || worldData.settings.cpsLimit);

        worldDB.writeStorage("worldDB", worldData);
        showMainMenu(player);
        player.playSound("vr.stutterturn");
    });
};

function showAntiCombatLogMenu(player, worldData) {
    const form = new ModalFormData()
        .title("§e§lModules §0- §bAnti Combatlog")
        .toggle("§l§2Anti Combatlog", { defaultValue: worldData?.modules?.antiCombatLog || false })
        .submitButton("§l§aSave");

    form.show(player).then((r) => {
        if (r.canceled) return;

        worldData.modules.antiCombatLog = r.formValues[0] || false;
        worldDB.writeStorage("worldDB", worldData);
        showMainMenu(player);
        player.playSound("vr.stutterturn");
    });
};