import * as Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DiscordController } from '../discordController';
import { PermissionFlagsBits } from 'discord-api-types/v9';

export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unbans a user!')
        .addStringOption((option) => option.setName('name').setDescription('the name to unban').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const guildMember = interaction.member as Discord.GuildMember;
        if (!guildMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply('You do not have permission to unban users.');
        }

        const user = await DiscordController.getUserById(interaction, interaction.options.data[0].value as string);
        if (!user) {
            return interaction.reply(`User ${user} not found.`);
        }

        DiscordController.unbanPlayerByDiscordId(user.id);
        const userUnbannedEmbed = new Discord.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('User Unbanned')
            .addFields({
                name: 'User',
                value: `${user.username}#${user.discriminator} (${user.id}) was unbanned from the server.`,
            })
            .setThumbnail('https://i.imgur.com/HKTdezU.png')
            .setTimestamp();
        return await interaction.reply({ embeds: [userUnbannedEmbed] });
    },
};
