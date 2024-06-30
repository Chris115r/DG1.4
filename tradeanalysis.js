const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const trading = require('../tradingInstance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tradeanalysis')
        .setDescription('Get detailed analysis of your trades'),

    async execute(interaction) {
        const userId = interaction.user.id;
        if (!trading.isUserRegistered(userId)) {
            return interaction.reply({ 
                embeds: [
                    new EmbedBuilder()
                        .setDescription('❌ You must be registered to use this command.')
                        .setColor('#FF0000')
                ],
                ephemeral: true 
            });
        }

        const analysis = trading.getTradeAnalysis(userId);

        const embed = new EmbedBuilder()
            .setTitle('Trade Analysis')
            .addFields(
                { name: '📈 Total Trades', value: analysis.totalTrades.toString() },
                { name: '💰 Total Profit/Loss', value: `$${analysis.totalProfitLoss}` },
                { name: '📊 Average Profit/Loss per Trade', value: `$${analysis.avgProfitLoss}` },
                { name: '🏆 Win Rate', value: `${analysis.winRate}%` },
                { name: '🔝 Largest Profit', value: `$${analysis.largestProfit}` },
                { name: '🔻 Largest Loss', value: `$${analysis.largestLoss}` }
            )
            .setColor('#00FF00')
            .setFooter('Trade analysis', interaction.guild.iconURL());

        await interaction.reply({ embeds: [embed] });
    },
};
