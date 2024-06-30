const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const playersFilePath = path.join(__dirname, '../players.json');
const { updateLeaderboard } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editbalance')
        .setDescription('Edit the balance of a user')
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount to adjust').setRequired(true)),
    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!fs.existsSync(playersFilePath)) {
            return interaction.reply({ content: 'There are no registered users.', ephemeral: true });
        }

        const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));

        if (!players[targetUser.id]) {
            return interaction.reply({ content: 'The specified user is not registered.', ephemeral: true });
        }

        players[targetUser.id].balance += amount;
        fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));

        await interaction.reply({ content: `${targetUser.username}'s balance has been updated to ${players[targetUser.id].balance}.`, ephemeral: true });

        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'profit-allocation');
        if (logChannel) {
            await logChannel.send(`${targetUser.username}'s balance was adjusted by ${amount}. New balance: ${players[targetUser.id].balance}`);
        }

        await updateLeaderboard(client, interaction.guild);
    }
};
