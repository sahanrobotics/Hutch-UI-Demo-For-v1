const express = require('express');
const cors = require('cors');
const { getInitialMessages, handleReply } = require('./chatLogic');

const app = express();
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timeStr = new Date().toLocaleTimeString();
        console.log(`[${timeStr}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

const dataStore = require('./dataStore');

app.get('/api/data/complaints', (req, res) => {
    console.log(`📊 Fetching Complaints List`);
    res.json(dataStore.complaintsList);
});

app.get('/api/data/hidden-problems', (req, res) => {
    console.log(`👻 Fetching Hidden Problems List`);
    res.json(dataStore.HIDDEN_PROBLEMS);
});

app.get('/api/data/charts/:type', (req, res) => {
    const type = req.params.type;
    console.log(`📈 Fetching Chart Data: ${type}`);
    if (type === 'erlang1h') res.json(dataStore.erlangData1h);
    else if (type === 'erlang6h') res.json(dataStore.erlangData6h);
    else if (type === 'erlang24h') res.json(dataStore.erlangData24h);
    else if (type === 'mw') res.json(dataStore.mwData);
    else if (type === 'signaling') res.json(dataStore.signalingData);
    else res.status(404).json({ error: 'Not found' });
});

app.get('/api/chat/init/:id', (req, res) => {
    const id = req.params.id;
    console.log(`\n🚀 [CHAT INIT] Initializing chat session for ID: ${id}`);
    const messages = getInitialMessages(id);
    res.json({ messages });
});

app.post('/api/chat/message', (req, res) => {
    const { id, message, context } = req.body;
    console.log(`\n💬 [USER MESSAGE] ID: ${id}`);
    console.log(`   Message: "${message}"`);
    
    // Simulate AI processing delay
    setTimeout(() => {
        const reply = handleReply(id, message, context);
        console.log(`🤖 [BOT REPLY] Generated ${reply.length} response widget(s).`);
        res.json({ messages: reply });
    }, 400); // slight delay to make the skeleton loader visible and realistic
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`👀 Watching for API requests...`);
    console.log(`======================================\n`);
});
