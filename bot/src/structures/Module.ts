import fs from 'fs';
import path from 'path';
import { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody, REST, Routes } from 'discord.js';

import { EventEmitter } from "../types/IEventEmitter";
import { Bot } from "./Bot";
import { Command } from './Command';

export abstract class Module extends EventEmitter{
    priority: number = 0; // the higher the later to execute
    name: string = '';
    client?: Bot;
    commands = new Collection<string, Command>();

    // Used by the bot when loading modules
    register(client: Bot, name: string) : Module {
        this.name = name;
        this.client = client;
        return this;
    }

    abstract init(client: Bot) : Promise<void>;

    exec(event: string, ...params : any[]): void {
        // execute within this module, much readable listen call, dangerous when module does not exist
        super.exec(event, ...params); 
        // execute within the bot, I don't prefer the listen call, but safer when module can be non-existent. Does not work when super.init is not called
        this.client?.exec(`${this.name}:${event}`, ...params); 
    }

    async deploySlashCommands(guildID: string){
        if(!this.client) return;
        const { config : { token, clientID}} = this.client;

        const rest = new REST().setToken(token);

        // Map commands as acceptable Rest Bodies
        const commands : Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = this.commands
            .filter(cmd => ('data' in cmd && 'run' in cmd))
            .map(cmd => cmd.data.toJSON());

        console.log(`${this.name}: Registering ${commands.length} slash commands`);

        try {
            await rest.put(
                Routes.applicationGuildCommands(clientID, guildID),
                { body: commands }
            );
        } catch (error) {
            console.error(error);
        }
    }
}

// For client
export interface ModuleCollection {
    [name: string] : Module;
}