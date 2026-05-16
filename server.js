const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer({});

// Port configuration for cloud deployment
const PORT = process.env.PORT || 3000;

// Serve static frontend files (HTML/CSS)
app.use(express.static('public'));

// Handle the proxy routing
app.all('/proxy', (req, res) => {
    // Get the target URL from the query string (e.g., /proxy?url=https://google.com)
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required.');
    }

    // Forward the request to the target website
    proxy.web(req, res, { 
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true
    }, (error) => {
        console.error('Proxy Error:', error);
        res.status(500).send('Error loading the requested page.');
    });
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
