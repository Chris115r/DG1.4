const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of commands'),

    async execute(interaction) {
        const helpMessage = `
**Commands:**
/balance - Check your balance
/buy - Buy a trade
/editbalance - Edit a user's balance
/holdings - Check your holdings
/register - Register as a new trader
/reset - Reset all data
/sell - Sell a trade
/showtrade - Show details of a trade
/tradeanalysis - Get detailed analysis of your trades
`;

        await interaction.reply({ 
            embeds: [
                new EmbedBuilder()
                    .setTitle('Help')
                    .setDescription(helpMessage)
                    .setColor('#00FF00')
            ]
        });
    },
};
