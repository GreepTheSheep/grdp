require("dotenv").config();
const { execFile, execSync } = require("child_process"),
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

    const commands = [
        "Invoke-WebRequest "+process.env.TM_USERDATA_URL+" -OutFile UserData.zip",
        "Expand-Archive UserData.zip",
        "Remove-Item UserData.zip"
    ]

    execSync(`pwsh -Command "${commands.join(";")}"`);
    execFile(`docker-compose`, ["up"]);

    express.get('/', (req, res) => {
        res.send(readFileSync(".\\ngrok.log", "utf8"));
    });

    express.listen(port, () => {
        console.log('Express server listening on port '+port);
    });
})();