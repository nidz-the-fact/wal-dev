import { WalrusClient } from '@mysten/walrus';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import path from 'path';
import os from 'os';
import { createSpinner } from 'nanospinner';
import { cyan, green, red, dim } from 'colorette';

const spinner = createSpinner(`${cyan('Downloading and saving blob')}...`);

function getFileExtension(blobBytes: Uint8Array): string {
    const magicNumbers = {
        png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        jpeg: [0xFF, 0xD8, 0xFF, 0xE0],
        pdf: [0x25, 0x50, 0x44, 0x46],
        gif: [0x47, 0x49, 0x46, 0x38],
        mp4: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
        webm: [0x1A, 0x45, 0xDF, 0xA3],
        avi: [0x52, 0x49, 0x46, 0x46],
        mp3: [0x49, 0x44, 0x33],
        txt: [] // 
    };

    for (const [ext, signature] of Object.entries(magicNumbers)) {
        if (signature.length > 0 && signature.every((value, index) => value === blobBytes[index])) {
            return ext;
        }

        if (ext === 'txt') {
            const textContent = new TextDecoder().decode(blobBytes);
            if (isTextFile(textContent)) {
                return 'txt';
            }
        }
    }

    return 'bin';
}

function isTextFile(content: string): boolean {
    return /^[\x00-\x7F]*$/.test(content);
}

async function readBlob(blobId: string, network: 'mainnet' | 'testnet') {
    try {
        const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

        const walrusClient = new WalrusClient({
            network: network,
            suiClient,
        });

        spinner.start();

        const blobBytes = await walrusClient.readBlob({ blobId });
        return new Blob([new Uint8Array(blobBytes)]);
    } catch (error) {
        spinner.error({ text: red(`Failed to read blob: ${(error as Error).message}`) });
        throw error;
    }
}

async function saveFile(blob: Blob, blobId: string, filePath: string) {
    const startTime = performance.now();

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExtension = getFileExtension(new Uint8Array(buffer));
    const fullFilePath = path.join(filePath, `${blobId}.${fileExtension}`);

    await fs.writeFile(fullFilePath, buffer);

    const endTime = performance.now();
    const periodTime = (endTime - startTime) / 1000;

    spinner.success({ text: `${green('File saved successfully!')} ${fullFilePath}` });
    console.log(dim(`Period time: ${periodTime.toFixed(2)} seconds`));
}

export async function downloadBlob(blobId: string, network: 'mainnet' | 'testnet') {
    const blob = await readBlob(blobId, network);

    spinner.stop()

    const homeDir = os.homedir();
    const downloadsPath = path.join(homeDir, 'Downloads');

    const directoryChoices = [
        { name: 'Downloads', value: downloadsPath },
        { name: 'Custom Path', value: 'custom' }, // 
    ];

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'directory',
            message: 'Where would you like to save the file?',
            choices: directoryChoices,
        }
    ]);

    let filePath: string;

    if (answer.directory === 'custom') {
        const customPathAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'customPath',
                message: 'Enter custom path to save the file:',
                default: 'Path:/to/x', // Example path
            }
        ]);

        filePath = customPathAnswer.customPath;
    } else {
        filePath = answer.directory;
    }
    await saveFile(blob, blobId, filePath);
}
