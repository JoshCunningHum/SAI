import { Interaction, CacheType, SlashCommandBuilder, Message, ActionRowBuilder, EmbedBuilder } from 'discord.js';

import { Bot } from "../../../structures/Bot";
import { Module } from "../../../structures/Module";
import { Command } from "../../../structures/Command";
import { genEmbedPages } from '../../../utils/ComponentBuilders';

module.exports = <Command> {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all server commands'),
        
    async run(client: Bot, mod: Module, interaction: Interaction<CacheType>){
        if(!interaction.isChatInputCommand()) return;

        const pages : Array<EmbedBuilder> = [],  contentPerPage = 6;
        let page = 1, emptypage = false, cmdInfo = '';

        do {
            const pageStart = contentPerPage * (page - 1);
            const pageEnd = pageStart + contentPerPage;

            const commands = mod.commands.map(cmd => cmd).slice(pageStart, pageEnd).map(cmd => {
                cmdInfo = `**${cmd.data.name}**`;
                cmdInfo += `\n${cmd.data.description}`;
                cmd.data.options.forEach(opt => {
                    const optData = opt.toJSON();
                    cmdInfo += `\n- ${optData.name} - *${optData.description}*`
                })
                return cmdInfo;
            })

            if(commands.length) {
                const embed = new EmbedBuilder();
                embed.setAuthor({ name: 'Commands' })
                embed.setDescription(`${commands.join('\n')}`);
                embed.setColor(page%2 ? '#44b868' : '#b84e44');
                pages.push(embed);
                page++;
            }else{
                emptypage = true;
                if(page === 2){
                    return interaction.reply({embeds: [pages[0]]});
                }
            }

        }while(!emptypage);

        genEmbedPages(interaction, pages, { timeout: 4000 });

    }
}