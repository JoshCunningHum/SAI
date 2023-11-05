import { Interaction, CacheType } from 'discord.js';

export const handleInteractionError = async (interaction: Interaction<CacheType>, error: unknown, msg= 'There was an error while executing the command!') => {
    if(!interaction.isRepliable()) return;

    console.error(error);

    if(interaction.replied){
        await interaction.followUp({ content: msg, ephemeral: true});
    } else {
        await interaction.reply({ content: msg, ephemeral: true});
    }
}