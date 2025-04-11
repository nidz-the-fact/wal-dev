import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import Table from 'cli-table3';
import { createSpinner } from 'nanospinner';
import { cyan, gray, green, red, bold, dim, magentaBright } from 'colorette';

const WAL_COIN_TYPE = {
    mainnet: '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL',
    testnet: '0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL',
};

export async function getBalance(address: string, network: 'mainnet' | 'testnet' = 'testnet') {
    const client = new SuiClient({ url: getFullnodeUrl(network) });

    const spinner = createSpinner(`${cyan('Fetching balance')} from ${bold(network)} network...`).start();
    const startTime = performance.now();

    try {
        let suiBalance;
        let walBalance;

        if (network === 'testnet') {
            suiBalance = await client.getBalance({ owner: address });
            walBalance = await client.getBalance({
                owner: address,
                coinType: WAL_COIN_TYPE.testnet,
            });
        } else {
            suiBalance = await client.getBalance({ owner: address });
            walBalance = await client.getBalance({
                owner: address,
                coinType: WAL_COIN_TYPE.mainnet,
            });
        }

        const sui = suiBalance ? Number(BigInt(suiBalance.totalBalance)) / Number(MIST_PER_SUI) : 0;
        const wal = walBalance ? Number(BigInt(walBalance.totalBalance)) / Number(MIST_PER_SUI) : 0;

        spinner.success({ text: green('Balance fetched successfully!') });
        const endTime = performance.now();
        const periodTime = (endTime - startTime) / 1000;

        console.log(`${bold(gray('Network'))}: ${dim(network)}`);
        console.log(`${bold(gray('Wallet'))}: ${dim(address)}\n`);

        const table = new Table({
            head: [cyan('Token'), cyan('Balance')],
            style: { head: [], border: [] },
            chars: {
                top: '─', 'top-mid': '┬', 'top-left': '╭', 'top-right': '╮',
                bottom: '─', 'bottom-mid': '┴', 'bottom-left': '╰', 'bottom-right': '╯',
                left: '│', 'left-mid': '├', mid: '─', 'mid-mid': '┼',
                right: '│', 'right-mid': '┤', middle: '│'
            }
        });

        table.push(
            ['SUI', magentaBright(sui.toFixed(4))],
            ['WAL', magentaBright(wal.toFixed(4))]
        );
        
        console.log(table.toString());

        console.log(dim(`Period time: ${periodTime.toFixed(2)} seconds`));

    } catch (error) {
        spinner.error({ text: red(`Failed to fetch balance: ${(error as Error).message}`) });
    }
}
