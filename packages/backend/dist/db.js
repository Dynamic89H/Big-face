"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.pool = new pg_1.Pool({
    connectionString: config_1.config.databaseUrl,
    // Sensible default for a single Node process; tune via env if needed.
    max: 20,
});
exports.pool.on('error', (err) => {
    // A pool-level error (e.g. idle client failure) shouldn't silently vanish.
    console.error('[db] unexpected pool error', err);
});
