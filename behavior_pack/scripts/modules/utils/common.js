/**
 * @param {string} data - The string to check
 * @returns {boolean} - Returns true if json, false if not
 */
function isJSON(data) {
    try {
        const parsedString = JSON.parse(data);
        return (typeof parsedString === "object" && parsedString !== null || Array.isArray(parsedString));
    } catch (e) {
        return false;
    };
};

export { isJSON };