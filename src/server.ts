console.log("Iniciando servidor...");

import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);


const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}