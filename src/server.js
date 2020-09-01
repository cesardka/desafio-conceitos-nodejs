const app = require("./app");

app.listen(3333, () => {
    const hostPort = "3333";
    const hostAddr = `http://localhost:${hostPort}`;
    console.log(`Iniciado o serviço no endereço ${hostAddr}`);
});
