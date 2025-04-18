import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient, BlobBlockedError, BlobNotCertifiedError } from '@mysten/walrus';

export const startServer = () => {
    const app = new Hono();
    const cache = new Map<string, Blob>();

    const clients = {
        mainnet: new WalrusClient({
            network: 'mainnet',
            suiClient: new SuiClient({ url: getFullnodeUrl('mainnet') }),
        }),
        testnet: new WalrusClient({
            network: 'testnet',
            suiClient: new SuiClient({ url: getFullnodeUrl('testnet') }),
        }),
    };

    app.get('/v1/blobs/:network/:id', async (c) => {
        const network = c.req.param('network');
        const blobId = c.req.param('id');
        const walrusClient = clients[network as 'mainnet' | 'testnet'];

        if (!['mainnet', 'testnet'].includes(network)) {
            return c.json({ error: 'Invalid network' }, 400);
        }

        if (!blobId) {
            return c.json({ error: 'Missing blob id' }, 400);
        }

        const cacheKey = `${network}:${blobId}`;
        if (cache.has(cacheKey)) {
            return c.body(cache.get(cacheKey)!.stream());
        }

        try {
            const blob = await walrusClient.readBlob({ blobId });
            cache.set(cacheKey, new Blob([blob]));
            return c.body(blob.buffer as ArrayBuffer);
        } catch (error) {
            if (error instanceof BlobBlockedError || error instanceof BlobNotCertifiedError) {
                return c.json({ error: 'Blob not found', details: error.message }, 404);
            }

            console.error('Error fetching blob:', error);
            return c.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 500);
        }
    });

    setInterval(() => {
        console.log(`[${new Date().toLocaleString()}] Server is active...`);
    }, 60000); // 60000 = 1 m

    serve(app, (info) => {
        console.log(`Server running on http://127.0.0.1:${info.port}`);
        console.log(`=== View blob details ===`);
        console.log(`\x1b[33mTestnet\x1b[0m: http://127.0.0.1:${info.port}/v1/blobs/testnet/\x1b[38;5;208m<blobId>\x1b[0m`);
        console.log(`\x1b[32mMainnet\x1b[0m: http://127.0.0.1:${info.port}/v1/blobs/mainnet/\x1b[38;5;208m<blobId>\x1b[0m\n`);
    });
};
