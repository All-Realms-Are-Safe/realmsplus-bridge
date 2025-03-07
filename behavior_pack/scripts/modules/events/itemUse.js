import { world, Player } from "@minecraft/server";
import { showMainMenu } from "../gui/home.js";

world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    if (!(player instanceof Player) || !player.hasTag("admin")) return;
    if (event.itemStack.typeId === "minecraft:compass") {
        showMainMenu(player);
    };
});