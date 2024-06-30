const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const playersFilePath = path.join(__dirname, '../players.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Displays your current balance'),
    async execute(interaction) {
        const userId = interaction.user.id;

        if (!fs.existsSync(playersFilePath)) {
            return interaction.reply({ content: 'No registered users found.', ephemeral: true });
        }

        const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));

        if (!players[userId]) {
            return interaction.reply({ content: 'You are not registered. Please use /register to get started.', ephemeral: true });
        }

        const balance = players[userId].balance;
        await interaction.reply({ content: `Your current balance is $${balance}.`, ephemeral: true });
    }
};
