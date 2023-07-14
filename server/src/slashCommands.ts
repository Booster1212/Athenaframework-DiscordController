import { Collection, Events, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { DISCORD_CONFIG } from '../config';

import path from 'path';
import { client } from './discordController';

client.commands = new Collection();
const commands = [];
const foldersPath = path.join(`${process.cwd()}/resources/core/plugins/discord/server/src/commands/`);

export async function loadCommands() {
    const commandFiles = readdirSync(foldersPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const url = new URL(`file://${filePath}`);

        try {
            const { default: command } = await import(url.href);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        } catch (error) {
            console.error(`[ERROR] Error importing command file ${url.href}: ${error}`);
        }
    }

    const rest = new REST().setToken(DISCORD_CONFIG.TOKEN);
    (async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(DISCORD_CONFIG.CLIENT_ID, DISCORD_CONFIG.SERVER_ID), {
                body: commands,
            });

            console.log(`Successfully loaded ${commands.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});
