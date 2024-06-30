const express = require('express');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const tradingInstance = require('./tradingInstance');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/webhook', (req, res) => {
    const alert = req.body;
    const channel = client.channels.cache.find(channel => channel.name === 'alerts');
    if (channel) {
        channel.send(`Alert: ${alert.message}`);
    }
    res.status(200).send('Alert received');
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.login(token);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
