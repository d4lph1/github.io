const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let games = {};

app.use(express.static('public'));

app.get('/create-game', (req, res) => {
    const gameId = uuidv4();
    games[gameId] = { players: [], deckSize: req.query.deckSize, playerCount: req.query.playerCount };
    res.send({ gameId, link: `${req.protocol}://${req.get('host')}/?gameId=${gameId}` });
});

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.slice(1));
    const gameId = urlParams.get('gameId');

    if (games[gameId]) {
        games[gameId].players.push(ws);
        ws.on('message', (message) => {
            games[gameId].players.forEach(player => {
                if (player !== ws) {
                    player.send(message);
                }
            });
        });

        ws.on('close', () => {
            games[gameId].players = games[gameId].players.filter(player => player !== ws);
            if (games[gameId].players.length === 0) {
                delete games[gameId];
            }
        });
    } else {
        ws.close();
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
