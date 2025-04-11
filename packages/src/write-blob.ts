import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { WalrusClient } from '@mysten/walrus';
import { Agent, setGlobalDispatcher } from 'undici';
import { createSpinner } from 'nanospinner';
import { cyan, green, red, bold, gray, dim } from 'colorette';

setGlobalDispatcher(
  new Agent({
    connectTimeout: 60_000,
    connect: { timeout: 60_000 }
  })
);

export async function writeBlob(
  privateKey: string,
  fileBuffer: Buffer,
  network: 'mainnet' | 'testnet'
): Promise<boolean> {

  const spinner = createSpinner(`${cyan('Writing Blob')}...`).start();
  const startTime = performance.now();

  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
  const walrusClient = new WalrusClient({
    network,
    suiClient,
    storageNodeClientOptions: { timeout: 60_000 },
  });

  const secretKey = Ed25519Keypair.fromSecretKey(privateKey);

  try {
    const { blobId } = await walrusClient.writeBlob({
      blob: fileBuffer,
      deletable: false,
      epochs: 3,
      signer: secretKey,
    });

    const endTime = performance.now();
    const periodTime = (endTime - startTime) / 1000;

    spinner.success({ text: `${green('Blob written successfully!')}` });

    console.log(`${bold(gray('Blob ID'))}: ${cyan(blobId)}`);
    console.log(`${bold(gray('Transaction'))}: ${cyan(`https://walruscan.com/${network}/blob/${blobId}`)}`);
    console.log(dim(`Period time: ${periodTime.toFixed(2)} seconds`));
    return true;
  } catch (error) {
    spinner.error({ text: red(`Failed to write blob: ${(error as Error).message}`) });
    return false;
  }
}
