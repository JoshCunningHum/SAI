import { Interaction, CacheType, Events, Guild, Message } from 'discord.js';

import { Bot } from "../../../structures/Bot";
import { Event } from "../../../structures/Event";
import { Module } from "../../../structures/Module";
import { isFalsy } from '../../../utils/Validator';

module.exports = new Event(Events.MessageCreate, async(client : Bot, mod: Module,  msg: Message) => {
    const prefix = client.config.prefix;

    // Easter bunny
    if(msg.content.toLowerCase().includes('krislotte')) await msg.reply('real');

    // Get if it starts with prefix
    if(isFalsy(prefix) || !msg.content.startsWith(prefix)) return;

    // Extract arguments
    const args = msg.content.split(' ');
    const cmd = args.splice(0, 1)[0].substring(prefix.length);

    // DEV COMMAND - FORCE UPDATE SLASH COMMANDS ON ALL SERVERS, should only run on the devServer
    if(cmd === 'forceupdate' && msg.guildId === client.config.devServerID){
        await msg.reply({ content: (await Promise.all(client.guilds.cache.map(async guild => {
            try {
                await mod.deploySlashCommands(guild.id)
            }catch{
                return `${guild.name}: Failed`;
            }
            return `${guild.name}: Successful`;
        }))).join('\n')})
        return;
    }

    // Find command in the module
    const command = mod.commands.get(cmd);

    if(!command || !command.options?.nonSlashStrict) return;

    await command.run(client, mod, msg);
})