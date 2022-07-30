require("dotenv").config();
const fetch = require("node-fetch"),
    { execFile } = require("child_process"),
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
    console.log("Waiting for ngrok to start...");
    const ngrokTunnels = await fetch("https://api.ngrok.com/tunnels", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + process.env.NGROK_API_KEY,
            "Ngrok-Version": "2"
        }
    }).then(async r => await r.json());

    if (ngrokTunnels.tunnels.length === 0) {
        console.log("No ngrok tunnels found");
        process.exit(1);
    }

    const ngrokTunnel = ngrokTunnels.tunnels[0];

    // let ngrokURL = ngrokTunnel.public_url.replace(ngrokTunnel.public_url.substr(0, ngrokTunnel.public_url.indexOf("://") + 3), "");

    console.log("Ngrok URL: " + ngrokTunnel.public_url);

    express.get('/', (req, res) => {
        res.redirect(ngrokTunnel.public_url);
    });

    express.get('/log', (req, res) => {
        res.send(readFileSync(".\\ngrok.log", "utf8"));
    });

    express.listen(port, () => {
        console.log('Express server listening on port '+port);
    });
})();