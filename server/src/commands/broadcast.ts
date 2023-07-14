import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import * as Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Broadcasts a message to the Game-Server!')
        .addStringOption((option) =>
            option.setName('message').setDescription('The message to broadcast').setRequired(true),
        ),
    async execute(interaction: CommandInteraction) {
        const message = interaction.options.data[0].value as string;
        const guildMember = interaction.member as Discord.GuildMember;

        if (!guildMember.permissions.has('Administrator')) {
            return interaction.reply('You do not have permission to broadcast messages.');
        }

        await sendServerBroadcast(message);
        return await interaction.reply({ content: `[SERVER] ${message}`, ephemeral: true });
    },
};

async function sendServerBroadcast(message: string) {
    const allPlayers = alt.Player.all;
    allPlayers.forEach((player) => {
        Athena.player.emit.message(player, `[DISCORD - SERVER] ${message}`);
    });
}
