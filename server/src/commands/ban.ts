import * as Discord from 'discord.js';
import Database from '@stuyk/ezmongodb';

import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DiscordController } from '../discordController';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Account } from '@AthenaShared/interfaces/iAccount';
import { Collections } from '@AthenaServer/database/collections';

export default {
    data: new SlashCommandBuilder()
        .setName('banuser')
        .setDescription('Bans a user!')
        .addStringOption((option) =>
            option.setName('discordid').setDescription('The discordId to ban').setRequired(true),
        )
        .addStringOption((option) => option.setName('reason').setDescription('The reason to ban').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const guildMember = interaction.member as Discord.GuildMember;
        const discordId = interaction.options.data[0].value as string;
        const reason = interaction.options.data[1].value as string;
        const user = await DiscordController.getUserById(interaction, interaction.options.data[0].value as string);
        const hasDatabaseEntry = await Database.fetchData<Account>('discord', discordId, Collections.Accounts);

        if (!hasDatabaseEntry) {
            interaction.reply('This user is not in the database!');
            return false;
        }

        if (!guildMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply('You do not have permission to ban users.');
        }

        if (!user) {
            return interaction.reply(`User ${user} not found.`);
        }

        DiscordController.banPlayerByDiscordId(user.id, reason);
        const userBannedEmbed = new Discord.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('User Banned')
            .addFields({
                name: 'User',
                value: `${user.username}#${user.discriminator} (${user.id}) was banned from the server.`,
            })
            .setThumbnail('https://i.imgur.com/HKTdezU.png')
            .setTimestamp();
        return await interaction.reply({ embeds: [userBannedEmbed] });
    },
};
