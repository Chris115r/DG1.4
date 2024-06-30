const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const tradingInstance = require('./tradingInstance');

module.exports = {
    async updateLeaderboard(guild) {
        const leaderboardChannel = guild.channels.cache.find(channel => channel.name === 'leaderboard');
        if (!leaderboardChannel) return;

        const sortedPlayers = Object.values(tradingInstance.players).sort((a, b) => b.balance - a.balance);
        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setColor('#00FF00')
            .setDescription(sortedPlayers.map((player, index) => `${index + 1}. ${player.nickname} - $${player.balance}`).join('\n'));

        try {
            if (tradingInstance.leaderboardMessageId.messageId) {
                const message = await leaderboardChannel.messages.fetch(tradingInstance.leaderboardMessageId.messageId);
                await message.edit({ embeds: [embed] });
            } else {
                throw new Error('Message not found');
            }
        } catch (error) {
            const message = await leaderboardChannel.send({ embeds: [embed] });
            tradingInstance.leaderboardMessageId.messageId = message.id;
            tradingInstance.saveJSON('leaderboardMessageId.json', tradingInstance.leaderboardMessageId);
        }
    }
};
