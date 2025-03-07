import { worldDB, playerDB } from "../loader.js";
import manager from "../../managers/CommandManager.js";
import { world, system } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((event) => {
  const { message, sender } = event;
  const worldData = worldDB.readStorage("worldDB");
  let playerData = playerDB.readStorage("playerDB");
  if (!message || !sender) return;
  if (playerData[sender.id]?.muted) {
    event.cancel = true;
    system.run(() => sender.runCommand(`tellraw @s {"rawtext":[{"text":"§cYou are muted. §7Reason: §e${playerData[sender.id].reason || "None provided."}"}]}`));
    return;
  };
  // if (message.startsWith(".")) {
  //   event.cancel = true;
  //   manager.executeCommand(message.slice(1).split(" ")[0], sender, message.slice(1).split(" ").slice(1));
  //   return;
  // };
  if (worldData?.modules?.chatRanks) {
    const rankTags = sender.getTags().filter((tag) => tag.startsWith("rank:"));
    let ranks;
    if (!rankTags.length) {
      ranks = ["§6Member"];
    } else {
      ranks = rankTags.map((tag) => tag.split(":")[1]) || ["§6Member"];
    };

    event.cancel = true;
    if (message.length > 512 || message.includes("* External")) {
      event.cancel = true;
      system.run(() => sender.runCommand(`kick "${sender.name}" Blocked message detected.`));
    }
    try {
      world.sendMessage(`${ranks.map((rank) => `§8[§r${rank}§r§8]`).join(" ")} §7<${sender.name}> §f${message}`);
    } catch (e) {
      console.error("Error sending message:", e);
    }
  } else {
    event.cancel = true;
    world.sendMessage(`§7<${sender.name}> §f${message}`);
  };
});