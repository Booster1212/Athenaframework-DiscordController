import { PluginSystem } from '@AthenaServer/systems/plugins';
import { DiscordConfig } from './configuration/main';
import { DiscordController } from './src/controller';

const PLUGIN_NAME = 'DISCORD-CONTROLLER';
const Discord = new DiscordController();

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await Discord.connect(DiscordConfig.TOKEN);
});
