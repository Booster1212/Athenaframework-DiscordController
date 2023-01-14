import { Client, Embed, IntentsBitField, TextChannel } from 'discord.js';

export class DiscordController {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.GuildMessageTyping,
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.MessageContent,
            ],
        });
    }

    async connect(token: string) {
        await this.client.login(token);
        return console.log('DiscordController successfully connected | Logged in as: ' + this.client.user.tag);
    }

    sendMessage(channelId: string, message: string) {
        const channel = this.client.channels.cache.get(channelId) as TextChannel;
        if (!channel) {
            throw new Error(`Could not find text channel with id ${channelId}`);
        }

        channel.send(message);
    }

    sendEmbed(channelId: string, embed: Embed) {
        const channel = this.client.channels.cache.get(channelId) as TextChannel;
        if (!channel) {
            throw new Error(`Could not find text channel with id ${channelId}`);
        }

        channel.send({ embeds: [embed] });
    }

    addUserToWhiteList(userId: string, roleId: string) {
        const guild = this.client.guilds.cache.first();
        if (!guild) {
            throw new Error(`Could not find guild`);
        }

        const member = guild.members.cache.get(userId);
        if (!member) {
            throw new Error(`Could not find member with id ${userId}`);
        }

        member.roles.add(roleId);
    }

    removeUserFromWhiteList(userId: string, roleId: string) {
        const guild = this.client.guilds.cache.first();
        if (!guild) {
            throw new Error(`Could not find guild`);
        }

        const member = guild.members.cache.get(userId);
        if (!member) {
            throw new Error(`Could not find member with id ${userId}`);
        }

        member.roles.remove(roleId);
    }
}
