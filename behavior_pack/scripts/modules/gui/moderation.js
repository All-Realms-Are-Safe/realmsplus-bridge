import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import { showMainMenu } from "./home.js";
import { playerDB } from "../loader.js";

export function showModerationMenu(player) {
    const players = world.getAllPlayers();
    if (!players) return;
    const form = new ModalFormData()
        .title("§l§2Realms§f+ §0- §eModeration")
        .dropdown("§nSelect a player:", players.map(p => p.name))
        .dropdown("§nSelect an action:", ["Mute", "Unmute", "View Inventory"])
        .textField("Provide a reason (optional)", "")
        .submitButton("§l§aExecute");

    form.show(player).then(async (r) => {
        if (r.canceled) return;
        const target = players[r.formValues[0]];
        const action = r.formValues[1];
        const reason = r.formValues[2];
        if (!target) return;
        let playerData = await playerDB.readStorage("playerDB");
        switch (action) {
            case 0:
                playerData[target.id] = {
                    ...playerData[target.id],
                    muted: true,
                    reason: reason || null
                };
                target.sendMessage(`§cYou have been muted by a staff member!\n§7Reason: §e${reason || "None provided."}`);
                playerDB.writeStorage("playerDB", playerData);
                showMainMenu(player);
                player.playSound("note.bassattack");
                break;
            case 1:
                playerData[target.id] = {
                    ...playerData[target.id],
                    muted: false,
                    reason: null
                };
                target.sendMessage(`§aYou have been unmuted by a staff member!`);
                playerDB.writeStorage("playerDB", playerData);
                showMainMenu(player);
                player.playSound("note.bassattack");
                break;
            case 2:
                const inventory = playerData[target.id].inventory
                    .filter(item => item.id !== null)
                    .map(item => `§8- §ex${item.count} §f${item.id.replace("minecraft:", "")} §8(§nSlot ${item.slot}§8)`)
                    .join("\n");
                const formatted = inventory.replace(/"/g, '\\"');
                player.runCommand(`tellraw @s {"rawtext":[{"text":"§e§l${playerData[target.id].name}§r's Inventory:\\n${formatted}"}]}`);
                player.playSound("note.bassattack");
                break;
        }
    });
};