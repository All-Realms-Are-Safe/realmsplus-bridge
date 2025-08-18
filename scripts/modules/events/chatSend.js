import { world, system } from "@minecraft/server";
import { worldDB, playerDB } from "../loader.js";

world.beforeEvents.chatSend.subscribe(async (event) => {
    const { message, sender } = event;
    // v2.0+ Script API: must cancel event before dynamic property lookup or it won't work
    event.cancel = true;

    const worldData = worldDB.readStorage("worldDB");
    const playerData = await playerDB.readStorage("playerDB");
    if (playerData[sender.id]?.muted) {
        event.cancel = true;
        system.run(() => sender.sendMessage(`§cYou are muted. §7Reason: §e${playerData[sender.id].reason || "None provided."}`));
        return;
    };

    if (worldData?.modules?.chatRanks) {
        const formatMessage = worldData.settings.chat.customFormat || worldData.settings.chat.defaultFormat;
        const separator = worldData.settings.chat.separator;
        const ranks = sender.getTags()
            .filter(tag => tag.startsWith("rank:"))
            .map(tag => tag.replace("rank:", ""));
        
        if (ranks.length === 0) ranks.push("§6Member");

        const finalMessage = formatMessage.replaceAll(/\{(.+?)\}/gi, (_, key) => {
            switch (key.toLowerCase()) {
                case "ranks":
                    return ranks.join(separator);
                case "username":
                    return sender.name;
                case "message":
                    return message;
                default:
                    return `{${key}}`;
            }
        });
        
        world.sendMessage(finalMessage);
    } else {
        world.sendMessage(`§r<${sender.name}> ${message}`);
    }
});