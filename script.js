require("dotenv").config();
const fetch = require("node-fetch"),
    { execFile } = require("child_process"),
    sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    execFile(`.\\ngrok\\ngrok.exe`, [
        "start",
        "--all",
        "--authtoken=" + process.env.NGROK_AUTH_TOKEN,
        "--config=.\\ngrok.yml"
    ]);
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

    let ngrokURL = ngrokTunnel.public_url.replace(ngrokTunnel.public_url.indexOf("://") + 3, "");

    console.log("Ngrok URL: " + ngrokURL);

    await sleep(12 * 60 * 60 * 1000);
})();
