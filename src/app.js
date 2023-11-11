import express from "express";

import router from "./routes/index.js";
import main from "./database/conn.js";

const app = express();

app.use(express.json());

// Conexão ao banco de dados
const result = await main();

if (result === true) {

    console.log('Conexão ao banco efetuada com sucesso!');

    app.use(router);

    app.listen(3000, () => {

        console.log('Sevidor On!');
    });

} else {

    console.log(result);
}

export default app;
