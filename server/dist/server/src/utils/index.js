"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkinName = exports.parseCamel = exports.generateUsername = exports.wrap = void 0;
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
exports.wrap = wrap;
const generateUsername = (displayName) => {
    const lowercaseName = displayName.toLowerCase().replace(/\s+/g, "");
    const randomNumber = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    const uniqueUsername = lowercaseName + randomNumber;
    return uniqueUsername;
};
exports.generateUsername = generateUsername;
const parseCamel = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(exports.parseCamel);
    }
    const result = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
        const camelCaseKey = snakeToCamel(key);
        let value = obj[key];
        if (value instanceof Date) {
            // Check if the value is a Date object
            result[camelCaseKey] = value;
        }
        else if (typeof value === "object" && value !== null) {
            value = (0, exports.parseCamel)(value);
            result[camelCaseKey] = value;
        }
        else {
            result[camelCaseKey] = value;
        }
    });
    return result;
};
exports.parseCamel = parseCamel;
const generateSkinName = () => {
    const skins = ["nancy", "lucy", "ash", "adam"];
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    return randomSkin;
};
exports.generateSkinName = generateSkinName;
const snakeToCamel = (str) => {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
};
//# sourceMappingURL=index.js.map