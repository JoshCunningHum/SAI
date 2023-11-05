// Utility functions

export function isFalsy(object: null | undefined | string | number | object) : boolean {
    if(object === null || object === undefined) return true;
    if(typeof object === 'string' && object === '') return true;
    if(typeof object === 'number' && object === 0) return true;
    if(object instanceof Array && object.length === 0) return true;
    if(typeof object === 'object' && Object.getOwnPropertyNames(object).length === 0) return true;

    return false;
}

export function isTruthy(object: null | undefined | string | number | object) : boolean {
    return !isFalsy(object);
}

type Constructor<T> = new (...args: any[]) => T;

export function typeCheck<T, U>(object: any, A: Constructor<T>, B: Constructor<U>) : number {
    return object instanceof A ? 0 : object instanceof B ? 1 : -1;
}