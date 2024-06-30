require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Load environment variables
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Fetching existing application (/) commands.');

        const commands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        console.log(`Found ${commands.length} commands. Deleting...`);

        for (const command of commands) {
            await rest.delete(
                `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`
            );
            console.log(`Deleted command: ${command.name}`);
        }

        console.log('Successfully deleted all existing application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


