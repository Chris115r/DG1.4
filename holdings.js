const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const tradesFilePath = path.join(__dirname, '../trades.json');
const playersFilePath = path.join(__dirname, '../players.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('holdings')
        .setDescription('Displays your current holdings'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guild = interaction.guild;
        const member = guild.members.cache.get(userId);

        const role = guild.roles.cache.find(role => role.name === 'Paper Trader');
        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({ content: 'You are not registered as a paper trader. Please use /register to get started.', ephemeral: true });
        }

        if (!fs.existsSync(tradesFilePath)) {
            return interaction.reply({ content: 'No trades have been recorded yet.', ephemeral: true });
        }

        const trades = JSON.parse(fs.readFileSync(tradesFilePath, 'utf-8'));
        const userHoldings = trades.filter(trade => trade.userId === userId && trade.status === 'open');

        if (userHoldings.length === 0) {
            return interaction.reply({ content: 'You have no current holdings.', ephemeral: true });
        }

        let holdingsMessage = 'Your current holdings:\n';
        userHoldings.forEach(trade => {
            holdingsMessage += `Trade ID: ${trade.id}, Symbol: ${trade.symbol}, Type: ${trade.type}, Amount: ${trade.amount}\n`;
        });

        await interaction.reply({ content: holdingsMessage, ephemeral: true });
    }
};
