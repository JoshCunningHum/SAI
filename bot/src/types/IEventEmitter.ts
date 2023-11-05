export type IEVSCallback = (...params : any[]) => void | Promise<any>; 

export interface IEVS {
    [event: string] : Array<IEVSCallback>;
}

export interface IEventEmitter {
    __evs__ : IEVS;

    has(event : string) : boolean;
    listen(event: string, callback: IEVSCallback) : void;
    drop(event: string, callback: IEVSCallback) : void;
    exec(event: string, ...args : any[]) : void;
}

export class EventEmitter implements IEventEmitter{
    
    // Event Driven Module-Module Communication
    __evs__: IEVS;

    constructor(){
        this.__evs__ = {};
    }

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