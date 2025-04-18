# Commands

<br/>

# wal-dev <Badge type="tip" text="CLI Command Development Tools" />
`wal` is a command-line interface (CLI) tool designed to simplify testing and interaction with the Walrus. This CLI tool provides a fast and easy way to interact with the Sui blockchain, allowing you to perform tasks such as swap tokens, blob on walrus, and interacting with smart contracts.

## Preview
Demo only using `wal-dev` (wal) command. **Please do not publish Privatekey publicly**.
<div align="center">
  <video width="800" autoplay loop muted>
    <source src="../assets/test-wal.mp4" type="video/mp4">
  </video>
</div>

## Install
To use `wal-dev`, you'll need to install it globally via npm.

```bash
npm i -g wal-dev
```

## Call
After installing, you can call `wal` from your terminal using the available commands.
::: code-group Click to Faucet
```wal
wal
```
```wal-dev
wal-dev
```
```wd
wd
```
```walrus
walrus
```
:::

## Use
You can type the following command. to see additional required options.
### `balance`
Check the SUI and WAL token balance of an address.
```bash
wal balance 
```
### `get`
Swap SUI <-> WAL tokens at a 1:1 rate (testnet only).
```bash
wal get 
```
### `upload`
Upload file with "Path:/to/x.x" or "text" on Walrus.
```bash
wal upload 
```

## Syntax
Additional options in each desired use.
::: warning
⚠️ Never share your `private key`, Anyone with access can fully control your wallet.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *This section uses the [Sui SDK](https://sdk.mystenlabs.com/typescript/cryptography/keypairs) official*
:::
| Syntax          | Description                                               |
|-----------------|-----------------------------------------------------------|
| `<address>` | The wallet address to check |
| `<amount>` | Amount to swap (e.g., 0.1) |
| `<data>` | File "Path:/to/x.x" or "text" to upload |
| `<blobID>` | The blobId of the file to read |
| `-pk, --privateKey` `<key>` | Private key sign the transaction |
| `-n, --network` `<network>` | Specify network mainnet or testnet |
| `-t, --token` `<token>` | Token to receive: wal or sui |

## Keyword
Explain the meaning of each command.
| Keyword     | Description                                               |
|-------------|-----------------------------------------------------------|
| `wal`       | Main command used to run the `wal-dev` CLI tool |
| `balance`   | Check the SUI and WAL token balance of an address |
| `get`       | Swap SUI <-> WAL tokens at a 1:1 rate (testnet only) |
| `uoload`    | Upload file with "Path:/to/x.x" or "text" on Walrus |
| `read`      | Preview data from Walrus using blob ID |
| `start`      | Start a local:3000 Walrus server for testing |

## Note
Help remember more.
- ⚠️ <span style="color:red">Never reveal your **Private Key** can control the wallet and all transactions.</span>
- 🔧 `wal-dev` is a CLI tool for working with **Walrus Protocol** on **SUI Blockchain**.
- 🛠️ If there is an error or want to see all commands, use `wal <Keyword>`.
- 📁 Using `wal upload` supports both files ("Path:/to/x.x") and text ("Text").
- 🔗 `blobId` obtained from `upload` can be used in `read`.
