express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ override: true, path:"../.env" });

HOST = "0.0.0.0"
PORT = 3001

app = express()
app.use(cors({
    credentials: true,
    origin: process.env["FRONTEND_HOST"]
}));

app

app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`)
})