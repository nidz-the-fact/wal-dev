import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus';
import { createSpinner } from 'nanospinner';
import { cyan, green, red, bold, dim } from 'colorette';

async function readBlob(blobId: string, network: 'mainnet' | 'testnet'): Promise<Uint8Array> {
    const suiClient = new SuiClient({
        url: getFullnodeUrl(network),
    });

    const walrusClient = new WalrusClient({
        network: network,
        suiClient,
    });

    return await walrusClient.readBlob({ blobId });
}

function getFileExtension(blobBytes: Uint8Array): string {
    const magicNumbers: Record<string, number[]> = {
        png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        jpeg: [0xFF, 0xD8, 0xFF],
        pdf: [0x25, 0x50, 0x44, 0x46],
        gif: [0x47, 0x49, 0x46, 0x38],
        mp3: [0x49, 0x44, 0x33],
        mp4: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
        webm: [0x1A, 0x45, 0xDF, 0xA3],
        avi: [0x52, 0x49, 0x46, 0x46],
    };

    for (const [ext, signature] of Object.entries(magicNumbers)) {
        if (signature.every((val, idx) => val === blobBytes[idx])) {
            return ext;
        }
    }

    const text = new TextDecoder().decode(blobBytes);
    if (/^[\x00-\x7F]*$/.test(text)) return 'txt';

    return 'bin';
}

export async function showMetadata(blobId: string, network: 'mainnet' | 'testnet') {
    const spinner = createSpinner(`${cyan('Reading blob')} from ${bold(network)} network...`).start();
    const startTime = performance.now();

    try {
        const bytes = await readBlob(blobId, network);
        const ext = getFileExtension(bytes);
        const sizeKB = (bytes.length / 1024).toFixed(2);

        spinner.success({ text: green('Blob read successfully!') });
        const endTime = performance.now();
        const periodTime = (endTime - startTime) / 1000;

        let metadata = `\n📦 ${bold('Blob Metadata')}\n`;
        metadata += `• ${bold('Blob ID')}: ${dim(blobId)}\n`;
        metadata += `• ${bold('File Type')}: .${ext}\n`;
        metadata += `• ${bold('Size')}: ${bytes.length} bytes (${sizeKB} KB)\n`;

        if (ext === 'txt') {
            const text = new TextDecoder().decode(bytes);
            metadata += `• ${bold('Preview')}: ${text}`;
        } else {
            metadata += `• ${bold('Preview')}: \x1b[33mNo "Text" only .txt files can be previewed.\x1b[0m`;
        }

        console.log(metadata);
        console.log(dim(`Period time: ${periodTime.toFixed(2)} seconds`));
    } catch (error) {
        spinner.error({ text: red(`Failed to read blob: ${(error as Error).message}`) });
    }
}
