import express from 'express';
import { createServer } from 'node:http';
import { wisp } from 'wisp-server-node';
import { join } from 'node:path';

const app = express();
const server = createServer();
const PORT = process.env.PORT || 8080;

// Serve static frontend files from the "public" folder
app.use(express.static(join(process.cwd(), 'public')));

// Catch fallback routing for client-side routing
app.use((req, res) => {
    res.status(404).sendFile(join(process.cwd(), 'public', '404.html'));
});

// Route HTTP requests and WebSocket/Wisp streams
server.on('request', (req, res) => {
    app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(PORT, () => {
    console.log(`YouTube proxy successfully running on port ${PORT}`);
});
