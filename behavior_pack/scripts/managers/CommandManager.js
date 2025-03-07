// Defined for future use
// Command Example
/*
import manager from "../managers/CommandManager.js";

manager.registerCommand(
    {
        name: "help",
        description: "List all available commands",
        execute: (player, args) => {
            player.sendMessage("This is a test response.");
        }
    }
);
*/

class CommandManager {
    constructor() {
        this.commands = new Map();
    };

    /**
     * Registers a command with the manager.
     * 
     * @param {object} data - An object containing the command's properties.
     * @param {string} data.name - The name of the command.
     * @param {string} data.description - The description of the command.
     * @param {function} data.execute - The function to be called when the command is executed.
     * @throws {Error} If the command already exists.
     * @throws {Error} If the command does not have a name.
     * @throws {Error} If the command does not have a description.
     * @throws {Error} If the command does not have an execute function.
     */
    registerCommand(data) {
        if (this.commands.has(data.name)) return console.error(`[Realms+] Command ${data.name} already exists!`);
        if (!data.name) return console.error(`[Realms+] Command ${data.name} must have a name!`);
        if (!data.description) return console.error(`[Realms+] Command ${data.name} must have a description!`);
        if (!data.execute) return console.error(`[Realms+] Command ${data.name} must have an execute function!`);
        this.commands.set(data.name, { ...data, enabled: true });
    };

    /**
     * Toggles the disabled state of a command.
     * 
     * @param {string} name - The name of the command to toggle.
     * @param {boolean} state - The desired state; true to disable the command, false to enable it.
     */
    toggleCommand(name, state) {
        if (!this.commands.has(name)) return console.error(`[Realms+] Command ${name} does not exist!`);
        this.commands.get(name).enabled = state;
    };

    /**
     * Executes a command with the given name and arguments.
     * 
     * @param {string} name - The name of the command to execute.
     * @param {Player} player - The Player object of the player who executed the command.
     * @param {string[]} args - The arguments passed to the command.
     */
    executeCommand(name, player, args) {
        if (!this.commands.has(name)) return console.error(`[Realms+] Command ${name} does not exist!`);
        if (!this.commands.get(name).enabled) return player.sendMessage(`[Realms+] Command ${name} is disabled!`);
        this.commands.get(name).execute(player, args);
    };
};

const manager = new CommandManager();
export default manager;