import { Bot } from "./Bot";
import { Module } from "./Module";

export type EventCallback = (client: Bot, mod: Module, ...args : any[]) => void;

interface EventOptions {
    [key: string] : any;
}

export class Event {
    event: string;
    run: EventCallback; 
    options: EventOptions;

    constructor(name : string, run: EventCallback, options: EventOptions = {}){
        this.event = name;
        this.run = run;
        this.options = options;
    }
}