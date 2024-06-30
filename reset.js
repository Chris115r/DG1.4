const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const tradingInstance = require('../tradingInstance'); // Correct path to tradingInstance.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Resets specific data and/or removes the "Paper Trader" role from all users'),
    async execute(interaction) {
        const adminRole = 'Admin'; // Replace with your actual admin role name or ID
        if (!interaction.member.roles.cache.some(role => role.name === adminRole)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const playersFilePath = path.join(__dirname, '../players.json');
        const tradesFilePath = path.join(__dirname, '../trades.json');
        const leaderboardFilePath = path.join(__dirname, '../leaderboardMessageId.json');

        // Backup existing data
        fs.copyFileSync(playersFilePath, `${playersFilePath}.bak`);
        fs.copyFileSync(tradesFilePath, `${tradesFilePath}.bak`);

        // Reset data
        fs.writeFileSync(playersFilePath, '{}');
        fs.writeFileSync(tradesFilePath, '{}');
        
        // Update leaderboard
        tradingInstance.updateLeaderboard();

        await interaction.reply({ content: 'Data has been reset and leaderboard updated.' });
    }
};
