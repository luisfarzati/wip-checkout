"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitespaceSeparated = (s = "") => {
    const clean = (s || "").trim().replace(/\s+/g, " ");
    return clean ? clean.split(" ") : [];
};
