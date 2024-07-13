"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const logger_1 = require("./logger");
exports.pool = new pg_1.Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    user: process.env.NODE_ENV == "production"
        ? process.env.PGUSER_PROD
        : process.env.PGUSER,
    database: process.env.NODE_ENV == "production"
        ? process.env.PGDATABASE_PROD
        : process.env.PGDATABASE,
    max: 20,
});
exports.pool.on("error", (err, client) => {
    logger_1.logger.error("Unexpected error on idle client", err);
    process.exit(-1);
});
//# sourceMappingURL=psql.js.map