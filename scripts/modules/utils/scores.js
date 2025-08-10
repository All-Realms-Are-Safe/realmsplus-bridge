import { world } from "@minecraft/server"

export const addScore = (target, objective, value) => {
    try {
        world.scoreboard.getObjective(objective).addScore(target, value) ?? 0;
    } catch {
        return 0;
    };
};

export const removeScore = (target, objective, value) => {
    try {
        world.scoreboard.getObjective(objective).addScore(target, - value) ?? 0;
    } catch {
        return 0;
    };
};

export const setScore = (target, objective, value) => {
    try {
        return world.scoreboard.getObjective(objective).setScore(target, value) ?? 0;
    } catch (error) {
        return 0;
    };
};

export const createScore = (objective) => {
    try {
        world.scoreboard.addObjective(objective);
    } catch {
        return 0;
    };
};

export const getScore = (target, value, useZero = true) => {
    try {
        const objective = world.scoreboard.getObjective(value);
        if (typeof target == "string") return objective.getScore(objective.getParticipants().find((player) => player.displayName == target));
        return objective.getScore(target.scoreboardIdentity);
    } catch {
        return useZero ? 0 : NaN;
    };
};