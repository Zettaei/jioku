import { Pool } from "pg";

// OPTIMIZE: manually create/release client from Pool instead of auto, might be a bit faster
const primaryPool = new Pool({
    host: process.env["PG_HOST"],
    user: process.env["PG_USER"],
    password: process.env["PG_PASSWORD"]
});


export default primaryPool;
