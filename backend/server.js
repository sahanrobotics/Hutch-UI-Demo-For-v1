const express = require('express');
const cors = require('cors');
const { getInitialMessages, handleReply } = require('./chatLogic');

const app = express();
app.use(cors());
app.use(express.json());

const dataStore = require('./dataStore');

app.get('/api/data/complaints', (req, res) => {
    res.json(dataStore.complaintsList);
});

app.get('/api/data/hidden-problems', (req, res) => {
    res.json(dataStore.HIDDEN_PROBLEMS);
});

app.get('/api/data/charts/:type', (req, res) => {
    const type = req.params.type;
    if (type === 'erlang1h') res.json(dataStore.erlangData1h);
    else if (type === 'erlang6h') res.json(dataStore.erlangData6h);
    else if (type === 'erlang24h') res.json(dataStore.erlangData24h);
    else if (type === 'mw') res.json(dataStore.mwData);
    else if (type === 'signaling') res.json(dataStore.signalingData);
    else res.status(404).json({ error: 'Not found' });
});

app.get('/api/chat/init/:id', (req, res) => {
    const id = req.params.id;
    const messages = getInitialMessages(id);
    res.json({ messages });
});

app.post('/api/chat/message', (req, res) => {
    const { id, message, context } = req.body;
    const reply = handleReply(id, message, context);
    res.json({ messages: reply });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
