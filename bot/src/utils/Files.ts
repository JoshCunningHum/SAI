import fs from 'fs';
import path from 'path';

export function loadFiles<T>(folder: string, extension:string ='ts') : Array<T> {
    const files = fs.readdirSync(folder).filter(file => file.endsWith(extension));
    return files.map(file => require(path.join(folder, file)) as T);
}

export function loadDirs(folder: string) : Array<string> {
    return fs.readdirSync(folder, { withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}