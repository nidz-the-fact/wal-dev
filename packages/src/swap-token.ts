import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI, parseStructTag } from '@mysten/sui/utils';
import { WalrusPackageConfig } from '@mysten/walrus';
import { createSpinner } from 'nanospinner';
import { cyan, green, red, bold, gray, magentaBright } from 'colorette';

const TESTNET_WALRUS_PACKAGE_CONFIG = {
  systemObjectId: '0x6c2547cbbc38025cf3adac45f63cb0a8d12ecf777cdc75a4971612bf97fdf6af',
  stakingPoolId: '0xbe46180321c30aab2f8b3501e24048377287fa708018a5b7c2792b35fe339ee3',
  subsidiesObjectId: '0xda799d85db0429765c8291c594d334349ef5bc09220e79ad397b30106161a0af',
  exchangeIds: [
    '0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073',
    '0x19825121c52080bb1073662231cfea5c0e4d905fd13e95f21e9a018f2ef41862',
    '0x83b454e524c71f30803f4d6c302a86fb6a39e96cdfb873c2d1e93bc1c26a3bc5',
    '0x8d63209cf8589ce7aef8f262437163c67577ed09f3e636a9d8e0813843fb8bf1',
  ],
} satisfies WalrusPackageConfig;

export async function swapToken(
  amount: string,
  token: 'wal' | 'sui',
  options: {
    privateKey: string;
  }
) {
  const spinner = createSpinner(`${cyan('Swapping')} ${amount} ${token === 'wal' ? 'SUI → WAL' : 'WAL → SUI'}...`);
  try {
    const suiClient = new SuiClient({
      url: getFullnodeUrl('testnet'),
    });

    const secretKey = Ed25519Keypair.fromSecretKey(options.privateKey);
    const tx = new Transaction();
    const exchangeId = TESTNET_WALRUS_PACKAGE_CONFIG.exchangeIds[0];

    spinner.start();

    const exchange = await suiClient.getObject({
      id: exchangeId,
      options: { showType: true },
    });

    const exchangePackageId = parseStructTag(exchange.data?.type!).address;
    const inAmount = BigInt(Number(amount) * Number(MIST_PER_SUI));

    if (token === 'wal') {
      // SUI -> WAL
      const wal = tx.moveCall({
        package: exchangePackageId,
        module: 'wal_exchange',
        function: 'exchange_all_for_wal',
        arguments: [
          tx.object(exchangeId),
          coinWithBalance({ balance: inAmount }),
        ],
      });

      tx.transferObjects([wal], secretKey.toSuiAddress());
    } else if (token === 'sui') {
      // WAL -> SUI
      const sui = tx.moveCall({
        package: exchangePackageId,
        module: 'wal_exchange',
        function: 'exchange_all_for_sui',
        arguments: [
          tx.object(exchangeId),
          coinWithBalance({
            type: '0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL',
            balance: inAmount,
          }),
        ],
      });

      tx.transferObjects([sui], secretKey.toSuiAddress());
    } else {
      throw new Error(`Unsupported token: ${token}`);
    }

    const { digest } = await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: secretKey,
    });

    await suiClient.waitForTransaction({
      digest,
      options: { showEffects: true },
    });

    spinner.success({ text: `${green('Swap completed successfully!')} ` });

    console.log(`${bold(gray('Swapped'))}: ${magentaBright(amount)} ${token === 'wal' ? 'SUI → WAL' : 'WAL → SUI'}`);
    console.log(`${bold(gray('Transaction'))}: ${cyan(`https://suiscan.xyz/testnet/tx/${digest}`)}`);

  } catch (error) {
    spinner.error({ text: red(`Swap failed: ${(error as Error).message}`) });
  }
}
