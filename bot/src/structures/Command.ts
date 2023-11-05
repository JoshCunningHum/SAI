import { Interaction, SlashCommandBuilder } from 'discord.js';
import { Bot } from './Bot';
import { Module } from './Module';

export type CommandCallback = (client: Bot, mod: Module, ...args: any[]) => Promise<void>;

interface CommandOptions{
    cooldown?: number;
    nonSlashStrict?: boolean;
    [key: string] : any;
}

export interface Command{
    data: SlashCommandBuilder;
    run: CommandCallback;
    options?: CommandOptions;
}

/**Template */

// import { Bot } from "../../../structures/Bot";
// import { Command } from "../../../structures/Command";
// import { Interaction, CacheType, SlashCommandBuilder } from 'discord.js';

// module.exports = <Command> {
//     data: new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Replies with a pong'),
//     async run(interaction: Interaction<CacheType>, client: Bot, args: any[]){

//     }
// }