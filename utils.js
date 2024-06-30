const fs = require('fs');
const path = require('path');
const playersFilePath = path.join(__dirname, 'players.json');
const leaderboardMessageIdFilePath = path.join(__dirname, 'leaderboardMessageId.json');

async function updateLeaderboard(client, guild) {
    if (!fs.existsSync(playersFilePath)) {
        return;
    }

    const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));
    const sortedPlayers = Object.entries(players).sort(([, a], [, b]) => b.balance - a.balance);

    let leaderboardText = 'Leaderboard:\n';
    sortedPlayers.forEach(([id, player], index) => {
        leaderboardText += `${index + 1}. ${player.username}: $${player.balance}\n`;
    });

    let messageId;
    if (fs.existsSync(leaderboardMessageIdFilePath)) {
        messageId = JSON.parse(fs.readFileSync(leaderboardMessageIdFilePath, 'utf-8')).id;
    }

    const leaderboardChannel = guild.channels.cache.find(channel => channel.name === 'leaderboard');

    if (messageId) {
        try {
            const message = await leaderboardChannel.messages.fetch(messageId);
            await message.edit(leaderboardText);
        } catch (error) {
            console.error('Error fetching or editing leaderboard message:', error);
            const message = await leaderboardChannel.send(leaderboardText);
            fs.writeFileSync(leaderboardMessageIdFilePath, JSON.stringify({ id: message.id }, null, 2));
        }
    } else {
        const message = await leaderboardChannel.send(leaderboardText);
        fs.writeFileSync(leaderboardMessageIdFilePath, JSON.stringify({ id: message.id }, null, 2));
    }
}

module.exports = { updateLeaderboard };
