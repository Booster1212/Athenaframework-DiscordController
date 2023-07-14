import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { DISCORD_CONFIG } from './config';
import { DiscordController } from './src/discordController';
import { DiscordCommands } from './src/commandRegistry';
import { loadCommands } from './src/slashCommands';

const PLUGIN_NAME = 'Discord Plugin';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    if (!DISCORD_CONFIG.TOKEN) {
        alt.log(`~lr~[${PLUGIN_NAME}] No 'TOKEN' was provided please add bot token to config.`);
        alt.log(`~lr~Visit: https://discord.com/developers/applications`);
        return;
    }

    if (!DISCORD_CONFIG.SERVER_ID) {
        alt.log(`~lr~[${PLUGIN_NAME}] No discord 'SERVER_ID' was provided please add server id to config.`);
        return;
    }

    await loadCommands();
    DiscordController.init(DISCORD_CONFIG.TOKEN, DISCORD_CONFIG.SERVER_ID);

    if (DISCORD_CONFIG.ALLOW_LIST && DISCORD_CONFIG.ALLOW_LIST.ENABLED) {
        await DiscordController.isReady();
        await DiscordController.initAllowList(DISCORD_CONFIG.ALLOW_LIST.ROLE);
        DiscordCommands.init();
    }

    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});

Athena.player.events.on('selected-character', async (player: alt.Player) => {
    try {
        // await DiscordController.handleConnection(player);
    } catch (e) {
        console.log(e);
    }
});

Athena.player.events.on('player-disconnected', (player: alt.Player) => {});
