const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const tradesFilePath = path.join(__dirname, '../trades.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Creates a new trade')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of trade (buy/sell)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The stock or asset symbol')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of shares or units to trade')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('takeprofit')
                .setDescription('The take profit level')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('stoploss')
                .setDescription('The stop loss level')
                .setRequired(false)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const type = interaction.options.getString('type');
        const symbol = interaction.options.getString('symbol');
        const amount = interaction.options.getInteger('amount');
        const takeprofit = interaction.options.getInteger('takeprofit');
        const stoploss = interaction.options.getInteger('stoploss');

        // Validate trade type
        if (type !== 'buy' && type !== 'sell') {
            return interaction.reply({ content: 'Invalid trade type. Please choose either "buy" or "sell".', ephemeral: true });
        }

        // Validate the inputs and user registration...

        const trade = {
            id: generateTradeId(),
            userId: userId,
            type: type,
            symbol: symbol,
            amount: amount,
            takeprofit: takeprofit,
            stoploss: stoploss,
            status: 'open',
            timestamp: new Date().toISOString()
        };

        if (!fs.existsSync(tradesFilePath)) {
            fs.writeFileSync(tradesFilePath, JSON.stringify([]));
        }

        const trades = JSON.parse(fs.readFileSync(tradesFilePath, 'utf-8'));
        trades.push(trade);
        fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));

        const tradeConfirmation = `Trade ID: ${trade.id}\nSymbol: ${trade.symbol}\nType: ${trade.type}\nAmount: ${trade.amount}\nStatus: ${trade.status}`;
        const confirmButton = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('confirm_trade')
                .setLabel('Confirm Trade')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('cancel_trade')
                .setLabel('Cancel Trade')
                .setStyle('SECONDARY')
        );

        const filter = i => ['confirm_trade', 'cancel_trade'].includes(i.customId) && i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        await interaction.reply({ content: tradeConfirmation, components: [confirmButton], ephemeral: true });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_trade') {
                // Finalize and log the trade...
                await i.update({ content: 'Trade confirmed and logged.', components: [] });
            } else {
                // Cancel the trade and remove it from trades.json...
                await i.update({ content: 'Trade canceled.', components: [] });
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: 'Trade confirmation timed out.', components: [] });
            }
        });
    }
};

function generateTradeId() {
    return 'trade_' + Math.random().toString(36).substr(2, 9);
}
