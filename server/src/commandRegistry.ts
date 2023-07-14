import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { ConsoleCommander } from '../../../../shared/utility/consoleCommander';
import { LOCALE_DISCORD_ALLOW_LIST } from '../config/locales';
import { DiscordController } from './discordController';

export class DiscordCommands {
    static init() {
        alt.log('~lb~Discord Allow List Commands Loaded');
        Athena.commands.register(
            'addallowlist',
            '/addallowlist <discord_id>',
            ['admin'],
            DiscordCommands.addAllowListCommand,
        );
        Athena.commands.register(
            'removeallowlist',
            '/removeallowlist <discord_id>',
            ['admin'],
            DiscordCommands.removeAllowlistCommand,
        );

        ConsoleCommander.registerConsoleCommand('/addallowlist', DiscordCommands.addAllowListConsoleCommand);
        ConsoleCommander.registerConsoleCommand('/removeallowlist', DiscordCommands.removeAllowListConsoleCommand);
    }

    private static async addAllowListCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, 'Usage /addallowlist <discord_id>');
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LOCALE_DISCORD_ALLOW_LIST.ID_NOT_LONG_ENOUGH);
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            Athena.player.emit.message(player, `{FF0000}${LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD}`);
            return;
        }

        Athena.player.emit.message(
            player,
            `{00FF00}${LOCALE_DISCORD_ALLOW_LIST.ADD_TO_ALLOW_LIST} ${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        );
    }

    private static async removeAllowlistCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, '/removeallowlist <discord_id>');
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LOCALE_DISCORD_ALLOW_LIST.ID_NOT_LONG_ENOUGH);
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            Athena.player.emit.message(player, `{FF0000}${LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD}`);
            return;
        }

        Athena.player.emit.message(
            player,
            `{FFFF00} ${LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST} ${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        );
    }

    private static async addAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/addallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Added to the allow list. ${member.user.username}#${member.user.discriminator}`);
    }

    private static async removeAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/removeallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Removed from the allow list. ${member.user.username}#${member.user.discriminator}`);
    }
}
