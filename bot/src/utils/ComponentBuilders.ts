import { ButtonBuilder, CacheType, EmbedBuilder, Interaction, ActionRowBuilder, CommandInteraction, ButtonStyle, MessageCreateOptions, InteractionReplyOptions, ComponentType, CollectorFilter, ButtonInteraction } from "discord.js";

export interface EmbedPagesOptions{
    fromButton?: boolean;
    timeout?: number;
}

export const genEmbedPages = async (source : Interaction<CacheType>, pages : Array<EmbedBuilder>, options : EmbedPagesOptions) => {
    if(!source.isChatInputCommand()) return;

    const buttons = [
        new ButtonBuilder()
            .setCustomId('first')
            .setLabel('<<')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('<')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('>')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('last')
            .setLabel('>>')
            .setStyle(ButtonStyle.Secondary)
    ];
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    let currentPage = 0;
    let content = <InteractionReplyOptions>{
        embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
        components: [row]
    }
    
    if(!source.channel) return;

    const message = await source.reply(content);
    const pagedMessage = message;

    const filter =  (button : ButtonInteraction<CacheType>) => !!button.component.label && ['<<', '<', '>', '>>'].includes(button.component.label);
    const collector = pagedMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: options.timeout || 4000 });

    collector.on("collect", async (button) => {
        switch(button.customId) {
            case 'first':
                currentPage = 0;
                break;
            case 'previous':
                currentPage = currentPage > 0 ? --currentPage : pages.length-1;
                break;
            case 'next':
                currentPage = currentPage+1 < pages.length ? ++currentPage : 0;
                break;
            case 'last':
                currentPage = pages.length-1;
                break;
        }
        switch(currentPage) {
            case 0:
                row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                break;
            case pages.length-1:
                row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
                break;
            default:
                row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                break;
        }
        pagedMessage.edit({
            embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
            components: [row]
        });
        collector.resetTimer();
        await button.deferUpdate();
    });

    collector.on("end", (_, reason) => {
        if(reason !== "messageDelete") {
            row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
            pagedMessage.edit({
                embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
                components: [row]
            }).catch(error=> {});
        }
    });
    return pagedMessage;
};