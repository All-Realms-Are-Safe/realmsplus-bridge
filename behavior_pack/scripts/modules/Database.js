import { world } from "@minecraft/server";
await null;
/**
 * World Database Management
 */
export class Database {
    constructor(name, defaultValue = {}) {
        this.name = name;
        this.defaultValue = defaultValue;
    };

    /**
     * Initialize database if it doesn't exist
     */
    init() {
        // FOR DEV
        // this.writeStorage(this.name, this.defaultValue);
        // FOR PRODUCTION
        const existingData = this.readStorage(this.name);
        if (!existingData || typeof existingData !== "object") {
            this.writeStorage(this.name, this.defaultValue);
        };
    };

    /**
     * Reads from the World Database
     * @param {string} key - The key for this database
     * @returns The stored data
     */
    readStorage(key) {
        try {
            const data = world.getDynamicProperty(key);
            return data ? JSON.parse(data) : this.defaultValue;
        } catch (e) {
            console.error("Error in readStorage:", e);
            return this.defaultValue;
        };
    };

    /**
     * Writes to the World Database
     * @param {string} key - The key for this database
     * @param {object} data - The data to store
     */
    writeStorage(key, data) {
        try {
            world.setDynamicProperty(key, JSON.stringify(data));
        } catch (e) {
            console.error("Error in writeStorage:", e);
        };
    };
};