import { Bot } from "../../../structures/Bot";
import { Event } from "../../../structures/Event";
import { Interaction, CacheType, Events } from 'discord.js';
import { Module } from "../../../structures/Module";

module.exports = new Event(Events.InteractionCreate, async(client : Bot, mod: Module, interaction: Interaction<CacheType>) => {
    if(!interaction.isChatInputCommand()) return;
    interaction.reply('Sheeesh');
})