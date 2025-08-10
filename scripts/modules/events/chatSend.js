import { world, system } from "@minecraft/server";
import { worldDB, playerDB } from "../loader.js";

world.beforeEvents.chatSend.subscribe(async (event) => {
    const { message, sender } = event;
    const worldData = worldDB.readStorage("worldDB");
    let playerData = await playerDB.readStorage("playerDB");
    if (!message || !sender) return;
    if (playerData[sender.id]?.muted) {
        event.cancel = true;
        system.run(() => sender.runCommand(`tellraw @s {"rawtext":[{"text":"§cYou are muted. §7Reason: §e${playerData[sender.id].reason || "None provided."}"}]}`));
        return;
    };
    if (message.length > 512 || message.includes("* External")) {
        event.cancel = true;
        system.run(() => sender.runCommand(`kick "${sender.name}" Blocked message detected.`));
        return;
    };
    if (worldData?.modules?.chatRanks) {
        const rankTags = sender.getTags().filter((tag) => tag.startsWith("rank:"));
        let ranks;
        if (!rankTags.length) {
            ranks = ["§6Member"];
        } else {
            ranks = rankTags.map((tag) => tag.split(":")[1]) || ["§6Member"];
        };
        event.cancel = true;
        world.sendMessage(`${ranks.map((rank) => `§8[§r${rank}§r§8]`).join(" ")} §7<${sender.name}> §f${message}`);
    } else {
        event.cancel = true;
        world.sendMessage(`§7<${sender.name}> §f${message}`)
    }
});