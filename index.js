const express = require("express");
const app = express();
const GetToken = require('./controller/GetToken');

app.get("/", (req, res) => res.send(GetToken.encryp()) )

app.use((req, res) => res.status(404).send("404"));

app.listen(3001, () => {
  console.log("Servidor rodando");
});