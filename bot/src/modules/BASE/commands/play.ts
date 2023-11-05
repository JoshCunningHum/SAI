import { Interaction, CacheType, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from 'discord-voip';
import { useMainPlayer } from "discord-player";

import { Bot } from "../../../structures/Bot";
import { BaseModule } from "../index";
import { Command } from "../../../structures/Command";

module.exports = <Command> {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins a video chat and plays a song')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('A source link for song/s. See `/help sources` for full source list.')
                .setRequired(true)
                .setMaxLength(50)),
    async run(client: Bot, mod: BaseModule, interaction: Interaction<CacheType>){
        // TODO: Manual running as if no interaction happened (for socket-access)

        if(!interaction.isChatInputCommand()) return;
        if(!interaction.member || interaction.member.user.bot) return;
        // Extract parameters
        const userID = interaction.member.user.id;
        const guild = interaction.guild;
        const query = interaction.options.getString('query', true);
        if(!guild) return; // TS Things
        
        const me = guild.members.me;
        const player = useMainPlayer();
        // idk what to type to tell TS so that we can just do interaction.member.voice.channel
        const channel = guild.members.cache.get(userID)?.voice.channel; 
        if(!me) return; // TS Things

        // Check if user is in a voice chat
        if(!channel) return await interaction.reply({ content: `Please join a voice channel before playing a song`, ephemeral: true });
        // Check if user voice channel is the same as ours
        if(me.voice.channel && channel.id !== me.voice.channel.id) return await interaction.reply({ content: `Please join ${me.voice.channel.name} VC instead`});
        
        await interaction.deferReply();

        // Get voice channel connection
        const connection = getVoiceConnection(guild.id) || joinVoiceChannel({channelId: channel.id, guildId: guild.id, adapterCreator: channel.guild.voiceAdapterCreator});

        const queue = await player.nodes.create(guild, {
            disableVolume: false,
            disableEqualizer: true,
            disableHistory: true,
            disableResampler: true,
            disableFilterer: true,
            disableBiquad: true,
            bufferingTimeout: 1000,
            leaveOnEnd: true,
            leaveOnStop: true,
            selfDeaf: true,
        })

        queue.createDispatcher(connection);

        const { track } = await queue.play(query, { 
            afterSearch: async (result) => {
                // Can do filtering here and things
                console.log(result)
                return result
            }
        })

        return interaction.followUp(`**${track.title}** enqueued!`);
    

        // Add song in the player
        // play that sheyt
    }
}