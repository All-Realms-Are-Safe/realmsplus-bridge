import { Player } from "@minecraft/server";
import { playerDB } from "../loader.js";


/**
 * Retrieves the current contents of the player's inventory, including the slot index.
 * Returns an array of objects with properties 'id', 'count', and 'slot'.
 * If a slot is empty, the 'id' property will be `null`.
 * @param {Player} player - The player whose inventory to retrieve
 * @returns {Array<{id: string|null, count: number, slot: number}>} The inventory contents
 */
function getInventoryContents(player) {
    try {
        const inventory = player.getComponent("minecraft:inventory");
        const contents = [];
        if (inventory) {
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                contents.push(item ? {
                    id: item.typeId,
                    count: item.amount,
                    slot: i
                } : {
                    id: null,
                    count: 0,
                    slot: i
                });
            }
            return contents;
        };
    } catch (e) {
        console.error("Error in getInventoryContents:", e);
        return [];
    };
};


/**
 * Gets the player's current and max health.
 * @param {Player} player - The player to get the health of
 * @returns {{current: number, max: number}} The player's current and max health
 */
function getHealth(player) {
    try {
        const health = player.getComponent("minecraft:health");
        return {
            current: health.currentValue,
            max: health.effectiveMax
        };
    } catch (e) {
        console.error("Error in getHealth:", e);
        return {
            current: "N/A",
            max: "N/A"
        };
    };
};

/**
 * Updates the stored player model with the latest data from the player.
 * @param {Player} player - The player to update
 */
function updateModel(player) {
    try {
        let playerData = playerDB.readStorage("playerDB");
        if (!playerData[player.id]?.id) {
            playerData[player.id] = {
                name: player.name,
                id: player.id,
                location: player.location,
                dimension: player.dimension,
                gamemode: player.getGameMode(),
                health: getHealth(player),
                xp: player.getTotalXp(),
                tags: player.getTags(),
                inventory: getInventoryContents(player),
                echest: null,
                metadata: {
                    storedOn: Date.now(),
                    lastUpdated: Date.now()
                },
                muted: false,
                reason: null
            };
            playerDB.writeStorage("playerDB", playerData);
        } else {
            playerData[player.id] = {
                ...playerData[player.id],
                location: player.location,
                dimension: player.dimension,
                gamemode: player.getGameMode(),
                health: getHealth(player),
                xp: player.getTotalXp(),
                tags: player.getTags(),
                inventory: getInventoryContents(player),
                echest: null,
                metadata: {
                    storedOn: playerData[player.id].metadata.storedOn,
                    lastUpdated: Date.now()
                }
            };
            playerDB.writeStorage("playerDB", playerData);
        };
    } catch (e) {
        console.error("Error in updateModel:", e);
    };
};

export {
    getInventoryContents,
    getHealth,
    updateModel
};