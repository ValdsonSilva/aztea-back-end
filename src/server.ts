console.log("Iniciando servidor...");

import express from "express";
import cors from "cors";
import WebSocket, {WebSocketServer} from "ws";
import http from "http";
import router from "./shared/routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);
const wss = new WebSocketServer({ server })

const PORT = process.env.PORT || 3000;

let clients: any[] = [];

wss.on('connection', (ws) => {
    console.log("Novo cliente conectado via WebSocket");
    clients.push(ws);

    // Enviar mensagem de boas vindas no sistema
    ws.send(JSON.stringify({message: "Welcome to Aztea-Media"}));

    // Remover o cliente da lista quando desconectar
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });

    // Receber mensagens do cliente (se necessário)
    ws.on('message', (message) => {
        console.log("Mensagem recebida do cliente:", message);
    });
});

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => console.log("Conectado!");
socket.onmessage = (msg) => console.log("Mensagem:", msg.data);
socket.onclose = () => console.log("Desconectado.");
socket.onerror = (err) => console.error("Erro:", err);


try {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}