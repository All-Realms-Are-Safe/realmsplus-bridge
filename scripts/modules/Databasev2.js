import { world, system } from "@minecraft/server";

/**
 * v2 of the database aims to be more efficient and friendly on memory
 * 
 * - static methods, swapping from multiple instances of the database
 * - in memory cache that is directly used across the pack instead of constantly reading/writing to the world
 * - auto-saving of cached data to the world
 * 
 * - save() method to allow all changes to be written to the world if needed
 * - reload() method to load world storage into memory
 * 
 * Example:
 * 
 * ```js
 * // Initialize the database
 * Database.init("playerDB", {
 *      username: "NoVa Gh0ul",
 *      money: 20
 * });
 * 
 * // Fetch data
 * const data = Database.get("playerDB");
 * data.money += 10;
 * 
 * // Store data, use whichever method(s) are needed
 * 
 * // Update the cache data
 * Database.set("playerDB", data);
 * 
 * // Update the world data
 * Database.save("playerDB");
 * 
 * // Reload the world data to the cache
 * Database.reload(); // leave empty to reload all databases
 * ```
 */
export class Database {
    /** @type {{ [key: string]: any }} */
    static #cache = {};

    /** @type {{ [key: string]: any }} */
    static #defaults = {};

    /** @type {Set<string>} keys queued for saving */
    static #dirtyKeys = new Set();

    static #DEBOUNCE_DELAY = 40; // every 2 seconds
    static #isSaving = false;

    /**
     * Initialize a new cached database with an optional default value
     * @param {string} name - Unique key for the DB
     * @param {object} defaultValue - Optional default object
     */
    static init(name, defaultValue = {}) {
        if (!(name in this.#defaults)) {
            this.#defaults[name] = defaultValue;
        };

        const data = this.#readStorage(name);
        this.#cache[name] = data ?? defaultValue;
    };

    /**
     * Get value from cache
     * @param {string} name - Database name
     * @returns {object} Cached data
     */
    static get(name) {
        return this.#cache[name] ?? this.#defaults[name];
    };

    /**
     * Update cache only
     * @param {string} name - Database name
     * @param {object} data - Data to write to cache
     */
    static set(name, data) {
        this.#cache[name] = data;
        this.#dirtyKeys.add(name);
        this.#debounceSave();
    };

    /**
     * Save cache to world
     * @param {string} name - Save a specific DB to the world, all if omitted
     */
    static save(name) {
        if (name) {
            const data = this.#cache[name];
            if (data !== undefined) {
                this.#writeStorage(name, data);
                this.#dirtyKeys.delete(name);
            };
        } else {
            for (const key of Object.keys(this.#cache)) {
                const data = this.#cache[key];
                if (data !== undefined) {
                    this.#writeStorage(key, data);
                    this.#dirtyKeys.delete(key);
                }
            };
        };
    };

    /**
     * Reload world storage into memory
     * @param {string} name - Reload a specific DB from the world, all if omitted
     */
    static reload(name) {
        if (name) {
            const data = this.#readStorage(name);
            this.#cache[name] = data ?? this.#defaults[name];
        } else {
            for (const key in this.#cache) {
                const data = this.#readStorage(key);
                this.#cache[key] = data ?? this.#defaults[key];
            };
        }
    };

    /**
     * Read data on the world
     * @param {*} key - Key to search for
     */
    static #readStorage(key) {
        try {
            const raw = world.getDynamicProperty(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error(`readStorage search for key ${key} failed:`, e);
            return null;
        }
    };

    /**
     * Write data to the world
     * @param {string} key - Key to store data at 
     * @param {*} data - Data to store
     */
    static #writeStorage(key, data) {
        try {
            world.setDynamicProperty(key, JSON.stringify(data));
        } catch (e) {
            console.error(`writeStorage for key ${key} failed:`, e);
        }
    };

    /**
     * Debounced auto saving of the cache to the world
     */
    static #debounceSave() {
        if (this.#isSaving) return;

        this.#isSaving = true;

        system.runTimeout(() => {
            try {
                for (const key of this.#dirtyKeys) {
                    const data = this.#cache[key];
                    if (data !== undefined) {
                        this.#writeStorage(key, data);
                    };
                };
            } catch (e) {
                console.error(`debounceSave failed while trying to save ${this.#dirtyKeys.size} keys:`, e);
            } finally {
                this.#dirtyKeys.clear();
                this.#isSaving = false;
            };
        }, this.#DEBOUNCE_DELAY);
    };
};