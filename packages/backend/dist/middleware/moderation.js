"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanText = cleanText;
const bad_words_1 = __importDefault(require("bad-words"));
const filter = new bad_words_1.default();
/**
 * Runs text through the profanity filter.
 * Returns the filtered text plus whether anything was flagged,
 * so callers can store `is_flagged` on messages for review.
 */
function cleanText(s) {
    if (!s)
        return { text: s, flagged: false };
    // Note: bad-words@1.x isProfane returns the matched word (string) or false,
    // so coerce to a real boolean — callers store this in a boolean column.
    const flagged = Boolean(filter.isProfane(s));
    return { text: flagged ? filter.clean(s) : s, flagged };
}
