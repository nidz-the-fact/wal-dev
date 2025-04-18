#!/usr/bin/env node
import * as fs from 'fs';
import { resolve } from 'path';
import { Command, Option } from 'commander';
import { getBalance } from './get-balance';
import { swapToken } from './swap-token';
import { writeBlob } from './write-blob';
import { showMetadata } from './read-blob';
import { startServer } from './server-mock';
import { dim, greenBright, reset, yellowBright } from 'colorette';

const program = new Command();

const packageJson = require(resolve(__dirname, '../../package.json'));
const currentVersion = packageJson.version || 'Unknown';

async function getPackageVersion(): Promise<string> {
  try {
    const response = await fetch('https://registry.npmjs.org/wal-dev');
    const data = await response.json();
    return data['dist-tags'].latest;
  } catch (error) {
    console.error('Error fetching version from npm:', error);
    return 'Unknown';
  }
}

getPackageVersion().then(latestVersion => {
  console.log(`
                            ▄▄                ▄▄                     
                          ▀███              ▀███                     
                            ██                ██                     
▀██▀    ▄█    ▀██▀▄█▀██▄    ██           ▄█▀▀███   ▄▄█▀██▀██▀   ▀██▀ 
  ██   ▄███   ▄█ ██   ██    ██         ▄██    ██  ▄█▀   ██ ██   ▄█   
   ██ ▄█  ██ ▄█   ▄█████    ██   █████ ███    ██  ██▀▀▀▀▀▀  ██ ▄█    
    ███    ███   ██   ██    ██         ▀██    ██  ██▄    ▄   ███     
     █      █    ▀████▀██▄▄████▄        ▀████▀███▄ ▀█████▀    █      

`);
  console.log(`${greenBright(`Latest version`)}: ${latestVersion}`);
  console.log(`${yellowBright(`Current version`)}: ${currentVersion}`);
  if (latestVersion > currentVersion) {
    console.log(`${dim('New version available! To update, run:')} ${reset('npm i -g wal-dev')}`);
  }
  console.log('');
});

program
  .name('wal')
  .description('wal-dev | npm package - Quick start toolkit for Walrus.')
  .version(currentVersion, '-v, --version', 'output the version number')
  .helpCommand(false)
  .addOption(new Option('-h, --help').hideHelp())

program
  .command('balance')
  .description('Check SUI and WAL balance of the given address')
  .showHelpAfterError(true)
  .helpOption(false)
  .argument('<address>', 'The wallet address to check')
  .option('-n, --network <network>', 'Specify network testnet or mainnet', 'testnet')
  .action(async (address: string, options: { network: 'testnet' | 'mainnet' }) => {
    try {
      await getBalance(address, options.network);
    } catch (error) {
      console.error('Error fetching balance:', (error as Error).message);
    }
  });

program
  .command('get')
  .description('Swap tokens SUI <-> WAL at 1:1 rate (testnet only)')
  .showHelpAfterError(true)
  .helpOption(false)
  .requiredOption('-pk, --privateKey <key>', 'Private key sign the transaction')
  .option('-t, --token <token>', 'Token to receive: wal or sui', 'wal')
  .argument('<amount>', 'Amount to swap (e.g., 0.1)')
  .action(async (
    amount: string,
    options: {
      privateKey: string;
      token?: string;
    }
  ) => {
    const token = options.token?.toLowerCase() as 'wal' | 'sui';
    if (token !== 'wal' && token !== 'sui') {
      console.error(`Invalid token: ${token}, - Use "wal" or "sui".`);
      process.exit(1);
    }
    try {
      await swapToken(amount, token, { privateKey: options.privateKey });
    } catch (error) {
      console.error('Error swaping:', error);
    }
  });

program
  .command('upload')
  .description('Upload file with "Path:/to/x.x" or "text" on Walrus')
  .showHelpAfterError(true)
  .helpOption(false)
  .requiredOption('-pk, --privateKey <key>', 'Private key sign the transaction')
  .requiredOption('-n, --network <network>', 'Specify network mainnet or testnet')
  .argument('<data>', 'File "Path:/to/x.x" or "text" to upload')
  .action(async (
    input: string,
    options: {
      privateKey: string,
      network: 'mainnet' | 'testnet'
    }
  ) => {
    try {
      if (fs.existsSync(input)) {
        const stats = fs.statSync(input);
        if (stats.isFile()) {
          const fileBuffer = fs.readFileSync(input);
          const success = await writeBlob(options.privateKey, fileBuffer, options.network);
          if (success) {
            console.log(`File upload successful: ${input}`);
          }
        } else {
          console.error(`Error: ${input} is not a valid file.`);
        }
      } else {
        console.error(`Error: The file at ${input} does not exist.`);
      }
    } catch (error) {
      console.error('Error uploading:', (error as Error).message);
    }
  });

program
  .command('read')
  .description('Preview data from Walrus using blob ID')
  .showHelpAfterError(true)
  .helpOption(false)
  .requiredOption('-n, --network <network>', 'Specify network mainnet or testnet')
  .argument('<blobId>', 'The blobId of the file to read')
  .action(async (blobId: string, options: { network: 'mainnet' | 'testnet' }) => {
    try {
      await showMetadata(blobId, options.network);
    } catch (error) {
      console.error('Error reading:', (error as Error).message);
    }
  });

program
  .command('start')
  .description('Start a local:3000 Walrus server for testing')
  .action(() => {
    try {
      startServer();
    } catch (error) {
      console.error('Error servering:', (error as Error).message);
    }
  });

program.parse(process.argv);
