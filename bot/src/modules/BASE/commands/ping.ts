import { Bot } from "../../../structures/Bot";
import { Module } from "../../../structures/Module";
import { Command } from "../../../structures/Command";
import { Interaction, CacheType, SlashCommandBuilder } from 'discord.js';

module.exports = <Command> {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gives info on the current bot latency'),
    async run(client: Bot, mod: Module, interaction: Interaction<CacheType>){
        if(!interaction.isChatInputCommand()) return;

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true});
        interaction.editReply(`Bot latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    }
}