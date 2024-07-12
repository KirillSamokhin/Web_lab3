import {router} from './router.js'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import http from 'http';
import WebSocket, {WebSocketServer} from 'ws'

let app = express();

// const currentFileUrl = import.meta.url;
// const currentFilePath = fileURLToPath(currentFileUrl);
//
// const currentDirectory = dirname(currentFilePath);

const options = {
    'credentials': true,
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept',
}

app.use(cors(options))

app.set('view engine', 'pug');
app.set('views', './src/views');

app.use(express.static('src'));

app.use('/', router);

const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
    console.log('Server is running on 3000');
});

const server = new WebSocketServer({ port: 8080 });

server.on('connection', ws => {
    ws.on('message', message => {
        if (message.toString().split(' ')[2] === 'exit') {
            ws.close()
        } else {
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString())
                }
            })
        }
    })
});

export default app;