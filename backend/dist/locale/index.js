"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageStrings = void 0;
const fs = require("fs");
const path = require("path");
const DEFAULT_LANGUAGE = 'en';
function loadLanguageFile(language) {
    const filePath = path.join(__dirname, '../../locale/', `${language}.json`);
    const defaultPath = path.join(__dirname, '../../locale/', `en.json`);
    const data = fs.readFileSync(filePath ? filePath : defaultPath, 'utf-8');
    return JSON.parse(data);
}
function getLanguageStrings(language) {
    if (!language) {
        return loadLanguageFile(DEFAULT_LANGUAGE);
    }
    try {
        return loadLanguageFile(language);
    }
    catch (e) {
        console.warn(`Failed to load "${language}" language file.`);
        return loadLanguageFile(DEFAULT_LANGUAGE);
    }
}
exports.getLanguageStrings = getLanguageStrings;
