import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';

let data: RootData | undefined;

/** Get information about the root of the projects code. */
export function getMainData() {
    if (data) return data;

    const workingDir = process.cwd();

    try {
        const packagePath = join(workingDir, 'package.json');
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
        const mainPath = join(workingDir, packageJson.main);

        return (data = {
            path: mainPath,
            directory: dirname(mainPath),
            type: packageJson.type === 'module' ? 'esm' : 'cjs',
        });
    } catch {
        // TODO: Log a warning here probably

        return (data = {
            path: join(workingDir, 'index.js'),
            directory: workingDir,
            type: 'cjs',
        });
    }
}

export interface RootData {
    path: string;
    directory: string;
    type: 'cjs' | 'esm';
}
