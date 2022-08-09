require("dotenv").config();
const { execFile } = require("child_process"),
    express = require('express')(),
    port = 15000,
    { readFileSync } = require("fs");

(async () => {
    execFile(`.\\ngrok\\ngrok.exe`, [
        "start",
        "--all",
        "--authtoken=" + process.env.NGROK_AUTH_TOKEN,
        "--config=.\\ngrok.yml"
    ]);
    console.log("https://dashboard.ngrok.com/cloud-edge/endpoints");

    express.get('/', (req, res) => {
        res.send(readFileSync(".\\ngrok.log", "utf8"));
    });

    express.listen(port, () => {
        console.log('Express server listening on port '+port);
    });

    execFile(`docker-compose`, ["up"]);
})();