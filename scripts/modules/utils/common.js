/**
 * @param {string} data - The string to check
 * @returns {boolean} - Returns true if json, false if not
 */
export function isJSON(data) {
    try {
        const parsedString = JSON.parse(data);
        return (typeof parsedString === "object" && parsedString !== null || Array.isArray(parsedString));
    } catch (e) {
        return false;
    };
};

/**
 * Sets a timer for a given value and unit of time.
 * @param {number} value - The value of the timer.
 * @param {string} unit - The unit of time for the timer. Can be 'hours', 'days', 'minutes', or 'seconds'.
 * @returns {Object} - An object containing the value, unit, and targetDate of the timer.
 */
export function setTimer(value, unit) {
    const targetDate = new Date();
    switch (unit) {
        case 'hours':
            targetDate.setHours(targetDate.getHours() + value);
            break;
        case 'days':
            targetDate.setDate(targetDate.getDate() + value);
            break;
        case 'minutes':
            targetDate.setMinutes(targetDate.getMinutes() + value);
            break;
        case 'seconds':
            targetDate.setSeconds(targetDate.getSeconds() + value);
            break;
    }
    return { value, unit, targetDate };
};

/**
 * Checks if the given date has been reached.
 * @param {Date|string|number} targetDate - The target date to check.
 * @returns {boolean} - Returns true if the given date has been reached, false otherwise.
 */
export function hasTimerReachedEnd(targetDate) {
    if (!(targetDate instanceof Date)) targetDate = new Date(targetDate);
    return Date.now() >= targetDate;
};

/**
 * Formats the given time in milliseconds into an object with the days, hours, minutes, and seconds.
 * @param {number} milliseconds - The time in milliseconds to format.
 * @returns {Object} - An object with the properties days, hours, minutes, and seconds.
 */
export const formatTime = (milliseconds) => ({
    days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
    hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
    seconds: Math.floor((milliseconds / 1000) % 60),
});

/**
 * Formats the time remaining until the given timer's target date into an object with the days, hours, minutes, and seconds.
 * @param {Object} timerInfo - An object containing the target date of the timer.
 * @param {Date} timerInfo.targetDate - The target date of the timer.
 * @returns {Object} - An object with the properties days, hours, minutes, and seconds.
 */
export const getTime = (timerInfo) => {
    const timeRemaining = new Date(timerInfo.targetDate).getTime() - Date.now();
    return formatTime(timeRemaining);
};