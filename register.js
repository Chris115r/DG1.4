const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const playersFilePath = path.join(__dirname, '../players.json');
const { updateLeaderboard } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register as a paper trader'),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const initialBalance = 100000;
        const roleName = 'Paper Trader';

        if (!fs.existsSync(playersFilePath)) {
            fs.writeFileSync(playersFilePath, JSON.stringify({}));
        }

        const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));
        const guild = interaction.guild;
        const member = guild.members.cache.get(userId);
        const role = guild.roles.cache.find(role => role.name === roleName);

        if (!member.roles.cache.has(role.id)) {
            if (players[userId]) {
                players[userId].balance = initialBalance;
            } else {
                players[userId] = {
                    username: username,
                    balance: initialBalance
                };
            }
            fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));

            await member.roles.add(role);
            await interaction.reply({ content: 'You have been registered and given the Paper Trader role!', ephemeral: true });

            const announcementChannel = guild.channels.cache.find(channel => channel.name === 'dg-announcements');
            if (announcementChannel) {
                await announcementChannel.send(`Welcome ${interaction.user} to the Paper Trading Game! Use /help to get started.`);
            }

            await updateLeaderboard(client, guild);
        } else {
            await interaction.reply({ content: 'You are already registered as a paper trader.', ephemeral: true });
        }
    }
};
