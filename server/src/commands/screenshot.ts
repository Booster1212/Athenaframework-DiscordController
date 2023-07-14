/* import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import * as Discord from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DiscordController } from '../discordController';
import * as fs from 'fs';
import path from 'path';

export default {
    data: new SlashCommandBuilder()
        .setName('screenshot')
        .setDescription('take a screenshot of a user and send it to discord.')
        .addStringOption((option) =>
            option.setName('discord_id').setDescription('the discord id of person to screenshot').setRequired(true),
        ),
    async execute(interaction: CommandInteraction) {
        const discordId = interaction.options.data[0].value as string;
        const guildMember = interaction.member as Discord.GuildMember;

        if (!guildMember.permissions.has('Administrator')) {
            return interaction.reply('You do not have permission to take a screenshot.');
        }

        const player = alt.Player.all.find((p) => {
            if (Athena.document.account.get(p).discord === discordId) {
                return true;
            }
            return false;
        });

        if (!player) {
            return false;
        }

        const data = Athena.document.character.get(player);
        const doesFileByPlayerNameExists = fs
            .readdirSync(process.cwd() + path.join('/screenshots/'))
            .find((x) => x === `${data.name}.jpg`);
        console.log(doesFileByPlayerNameExists);
        await DiscordController.takeScreenshotByDiscordId(discordId);
        const screenshotEmbed = new Discord.EmbedBuilder()
            .setTitle('Screenshot')
            .setImage(`attachment://test.jpg`)
            .setColor('#0099ff')
            .setTimestamp();
        return interaction.reply({
            embeds: [screenshotEmbed],
            files: [process.cwd() + `/screenshots/test.jpg`],
        });
    },
};
*/
