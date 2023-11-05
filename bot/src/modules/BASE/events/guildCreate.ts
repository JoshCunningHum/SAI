import { Interaction, CacheType, Events, Guild } from 'discord.js';

import { Bot } from "../../../structures/Bot";
import { Event } from "../../../structures/Event";
import { Module } from "../../../structures/Module";

module.exports = new Event(Events.GuildCreate, async(client : Bot, mod: Module,  guild: Guild) => {
    // Register slash commands
    try {
        await mod.deploySlashCommands(guild.id);
    } catch (err) {
        console.log(err);
    }
})