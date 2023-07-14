import * as Discord from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DISCORD_CONFIG } from '../../config';
import { DiscordController } from '../discordController';
import { PermissionFlagsBits } from 'discord-api-types/v9';

export default {
    data: new SlashCommandBuilder()
        .setName('removeallowlist')
        .setDescription('Removes a user from the allowlist!')
        .addStringOption((option) => option.setName('name').setDescription('The name to whitelist').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (!DISCORD_CONFIG.ALLOW_LIST.ENABLED || !DISCORD_CONFIG.ALLOW_LIST.ROLE) {
            console.log('[Athena-DiscordJS] The allow list is not enabled.');
            return interaction.reply('The allow list is not enabled.');
        }

        const guildMember = interaction.member as Discord.GuildMember;
        if (!guildMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply('You do not have permission to whitelist users.');
        }

        if (!guildMember.roles.cache.has(DISCORD_CONFIG.ALLOW_LIST.ROLE)) {
            return interaction.reply('This user is not allowlisted.');
        }

        const isUser = await DiscordController.removeFromAllowList(interaction.options.data[0].value as string, false);

        if (!isUser) {
            return interaction.reply('The user is not in the server / database.');
        }
        const user = await DiscordController.getUserById(interaction, interaction.options.data[0].value as string);
        const userRemovedFromAllowListEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('User Removed from Allow List')
            .setDescription(`${user.username}#${user.discriminator} (${user.id}) was removed from the allow list.`)
            .setThumbnail('https://i.imgur.com/HKTdezU.png')
            .setTimestamp();
        return await interaction.reply({ embeds: [userRemovedFromAllowListEmbed as unknown as Discord.Message] });
    },
};
