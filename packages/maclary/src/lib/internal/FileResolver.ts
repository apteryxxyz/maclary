import { existsSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { supportedExtensions } from './ModuleLoader';

/** Check whether a path points to a valid file. */
export function isFile(filePath: string) {
    const fileExists = existsSync(filePath);
    return fileExists && lstatSync(filePath).isFile();
}

/** Check whether a path points to a valid directory. */
export function isDirectory(folderPath: string) {
    const folderExists = existsSync(folderPath);
    return folderExists && lstatSync(folderPath).isDirectory();
}

/** Resolve the path to a directories index file. */
export function resolveDirectoryIndexPath(folderPath: string) {
    if (!isDirectory(folderPath)) return null;

    for (const extension of supportedExtensions) {
        const filePath = join(folderPath, `index${extension}`);
        if (isFile(filePath)) return filePath;
    }

    return null;
}
