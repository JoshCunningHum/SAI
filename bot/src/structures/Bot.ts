import path from 'path';
import { existsSync, readdirSync } from 'fs';
import { Client, GatewayIntentBits, Events } from 'discord.js';

import { Module, ModuleCollection } from './Module';
import { IEVS, IEVSCallback, IEventEmitter } from '../types/IEventEmitter';
import { isFalsy } from '../utils/Validator';
import { loadDirs } from '../utils/Files';
import config from '../../config';

interface IBotConfig {
    prefix: string,
    clientID: string;
    token: string;
    devServerID: string;
}

export class Bot extends Client implements IEventEmitter{
    config: IBotConfig;
    modules: ModuleCollection;
    requiredVoicePermissions = [ 'ViewChannel', 'Connect', 'Speak' ];
    requiredTextPermissions = [ 'ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AddReactions', 'EmbedLinks' ];

    constructor(){
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent
            ]
        });

        // setup discord things
        
        this.modules = {};
        this.config = {
            prefix: process.env.PREFIX || config.prefix,
            token: process.env.BOT_TOKEN || config.botToken,
            clientID: process.env.CLIENT_ID || config.clientId,
            devServerID: process.env.DEV_SERVER_ID || config.devServerID
        }
        this.__evs__ = {};
    }

    async init(){
        if(isFalsy(this.config.token)) return console.error('---- Error: Invalid bot token');

        console.log('---- Starting Bot ----');

        // Load Modules
        const modulePath = path.join(__dirname, '../modules');

        const modules : Array<Module> = loadDirs(modulePath)
            // filter for directories that has the index.ts file
            .filter(dir => existsSync(path.join(modulePath, `${dir}/index.ts`))) 
            // pre-initialize the module by providing this instance and giving its name (based on dir its in)
            .map(dir => (require(`../modules/${dir}/index`) as Module).register(this, dir))
            // Sort by module priority
            .sort((a, b) => a.priority - b.priority);
        
        console.log(`${modules.length} modules loaded!`);

        // Register modules
        modules.forEach(mod => this.modules[mod.name] = mod);

        // Initialize Modules
        await Promise.all(modules.map(async mod => {
            console.log(`- Initializing ${mod.name} module -`);
            await mod.init(this);
        }));

        this.on(Events.ClientReady, () => console.log('---- Bot is now ready ----'));
        
        this.login(this.config.token);

    }




    /** Forbidden parts, read in your own discretion 
     * 
     *  Yes this is a duplicate implementation of EventEmitter Class in the IEventEmitter
     *  This is because I don't know how to do multi-class inheritance in TS
     *  If I found a way, I'll refactor this right away
    */

    // Event Driven Module-Module Communication
    __evs__: IEVS;
    has(event: string): boolean { return this.__evs__[event] !== undefined; }
    listen(event: string, callback: IEVSCallback): void {
        this.__evs__[event] = this.__evs__[event] || new Array<IEVSCallback>;
        this.__evs__[event].push(callback);
    }
    drop(event: string, callback: IEVSCallback): void {
        if(!this.has(event)) return;
        // Added a check where even if 2 functions don't belong to the same reference in the memory, as long as they do the same thing in the same event name, they will be removed
        const indexes : Array<number> = this.__evs__[event].filter(ev => ev === callback || ev.toString() === callback.toString()).map((cb, i) => i);
        if(indexes.length > 0) for(let i = 0; i < indexes.length; i++) this.__evs__[event].splice(indexes[i] - i, 1);
    }
    exec(event: string, ...params : any[]) : void { this.has(event) && this.__evs__[event].forEach(ev => ev(...params)); }

}