import path from "path";
import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

import { Bot } from "../../structures/Bot";
import { Module } from "../../structures/Module";
import { Event } from "../../structures/Event";
import { loadFiles } from "../../utils/Files";
import { Command } from "../../structures/Command";
import { Player } from "discord-player";

// This is the base module, this consists of all base features of the bot
export class BaseModule extends Module{

    player?: Player;

    async init(client: Bot): Promise<void> {
        const { config : { token, clientID, devServerID}} = client;
        const { name, commands } = this;
    
        // Initialize Discord Player
        this.player = new Player(client, { skipFFmpeg: true });
        const player = this.player;
        await player.extractors.loadDefault();

        let count = 0;

        // Get all commands and store them in this module
        loadFiles<Command>(path.join(__dirname, './commands'))
            .forEach(cmd => {
                if(!('data' in cmd || 'execute' in cmd)) return;
                commands.set(cmd.data.name, cmd);
                count++;
            });

        console.log(`${name}: ${count} commands loaded`);

        // Register slash commands on devServer
        await this.deploySlashCommands(devServerID);
        
        count = 0;
        // Intialize Events (Discord)
        loadFiles<Event>(path.join(__dirname, './events'))
            .forEach(ev => {
                count++;
                if(ev.options.once) client.once(ev.event, ev.run.bind(null, client, this));
                else client.on(ev.event, ev.run.bind(null, client, this));
            })

        console.log(`${name}: ${count} events loaded`);

    }
}

module.exports = new BaseModule();