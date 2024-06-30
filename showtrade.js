const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const tradesFilePath = path.join(__dirname, '../trades.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showtrade')
        .setDescription('Displays the details of a specific trade')
        .addStringOption(option => option.setName('trade_id').setDescription('The ID of the trade').setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const tradeId = interaction.options.getString('trade_id');

        if (!fs.existsSync(tradesFilePath)) {
            return interaction.reply({ content: 'No trades have been recorded yet.', ephemeral: true });
        }

        const trades = JSON.parse(fs.readFileSync(tradesFilePath, 'utf-8'));
        const trade = trades.find(trade => trade.id === tradeId);

        if (!trade) {
            return interaction.reply({ content: 'Trade not found.', ephemeral: true });
        }

        if (trade.userId !== userId) {
            return interaction.reply({ content: 'You do not have permission to view this trade.', ephemeral: true });
        }

        let tradeDetails = `Trade ID: ${trade.id}\nSymbol: ${trade.symbol}\nType: ${trade.type}\nAmount: ${trade.amount}\nPrice: ${trade.price}\nStatus: ${trade.status}`;
        if (trade.takeprofit) tradeDetails += `\nTake Profit: ${trade.takeprofit}`;
        if (trade.stoploss) tradeDetails += `\nStop Loss: ${trade.stoploss}`;
        tradeDetails += `\nTimestamp: ${trade.timestamp}`;

        await interaction.reply({ content: tradeDetails, ephemeral: true });

        if (trade.status === 'open') {
            const closeTradeButton = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('close_trade')
                    .setLabel('Close Trade')
                    .setStyle('DANGER')
            );

            const filter = i => i.customId === 'close_trade' && i.user.id === userId;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

            collector.on('collect', async i => {
                trade.status = 'closed';
                // Update trade and user balance logic here...
                fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));
                await i.update({ content: 'Trade closed successfully.', components: [] });
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    await interaction.editReply({ content: 'Trade close timed out.', components: [] });
                }
            });
        }
    }
};
