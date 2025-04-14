# Get started

## Overview

<p align="center">
  <br>
  wal-dev | npm package - Quick start toolkit for Walrus.
  <br>
</p>

<div align="center" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
  <a href="https://www.npmjs.com/package/wal-dev">
    <img src="https://img.shields.io/npm/v/wal-dev" alt="Stars Badge" />
  </a>
  <a href="https://github.com/nidz-the-fact/wal-dev/stargazers">
    <img src="https://img.shields.io/github/stars/nidz-the-fact/wal-dev" alt="Stars Badge" />
  </a>
  <a href="https://github.com/nidz-the-fact/wal-dev/forks">
    <img src="https://img.shields.io/github/forks/nidz-the-fact/wal-dev" alt="Forks Badge"/>
  </a>
  <a href="https://github.com/nidz-the-fact/wal-dev/pulls">
    <img src="https://img.shields.io/github/issues-pr/nidz-the-fact/wal-dev" alt="Pull Requests Badge" />
  </a>
  <a href="https://github.com/nidz-the-fact/wal-dev/issues">
    <img src="https://img.shields.io/github/issues/nidz-the-fact/wal-dev" alt="Issues Badge" />
  </a>
  <a href="https://github.com/nidz-the-fact/wal-dev/graphs/contributors">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/nidz-the-fact/wal-dev?color=2b9348">
  </a>
</div>

<div align="center">
  <br>
  <p style="font-size: 12px; text-align: center; margin-bottom: 4px; line-height: 1.4;">
    <a href="https://www.npmjs.com/package/wal-dev" target="_blank" style="text-decoration: none;">wal-dev</a> is an 
    <a href="https://www.npmjs.com" target="_blank" style="text-decoration: none;">NPM package</a> designed to help developers of all levels get started quickly and reduce complexity when working with the 
    <a href="https://www.walrus.xyz/" target="_blank" style="text-decoration: none;">Walrus Protocol</a>, while maintaining flexibility and high performance.
  </p>

  <p style="font-size: 12px; text-align: center; margin-bottom: 4px; line-height: 1.4;">
    This tool is ideal for developers who prefer a clear project structure with the ability to customize as needed. With <code>wal-dev</code>, you'll get a set of ready-to-use commands and boilerplate code that streamlines setup and accelerates the development process efficiently.
  </p>

  <p style="font-size: 12px; text-align: center; margin-bottom: 4px; line-height: 1.4;">
    <code>wal-dev</code> is fully open source (feel-free), empowering the community to contribute, collaborate, and continuously improve the toolkit together, driving innovation for building on 
    <a href="https://x.com/WalrusProtocol" target="_blank" style="text-decoration: none;">Walrus</a>.
  </p>
</div>

## Features

- [CLI Command Development Tools](commands/commands.md)
  - Powerful command-line interface tools designed to accelerate and simplify development workflows. Ideal for building and managing on Walrus with ease.

## Installation

::: info
Before installing `wal-dev`, it is recommended to first install [Node.js v.18+](https://nodejs.org/en/download/prebuilt-installer/current) on your system to make sure it is installed correctly.
:::

::: tip
To use CLI Commands, you'll need to install it globally `-g` is a **global** package installation ([guide](https://docs.npmjs.com/cli/v9/commands/npm-install#global-installation)). <br>
"After installing, you can call `wal` from your terminal using the available commands"
:::

::: code-group

```bash [npm]
npm i -g wal-dev
```

```bash [yarn]
yarn add -g wal-dev
```

```bash [pnpm]
pnpm i -g wal-dev
```

```bash [bun]
bun add -g wal-dev
```

:::

## Donate
```suiAddress
0x308b05d9fb305a8e995ab9c89be0f3cada26d8db18ea76592c283921f772af71
```

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/106298826?v=4',
    name: 'Nidz',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/nidz-the-fact' },
      { icon: 'facebook', link: 'https://www.facebook.com/nid.muhammad' },
      { icon: 'discord', link: 'https://discord.com/users/686140944491479045' },
      { icon: 'x', link: 'https://x.com/nidzthefact' },
      { icon: 'youtube', link: 'https://www.youtube.com/channel/UCTzFa7zzyMMeyMHIdsb60nw' },
    ]
  },

]
</script>

<VPTeamPage>
  <VPTeamPageTitle style="margin-top: -120px;">
    <template #title>
      Developer
    </template>
    <template #lead>
      Core developers for building and maintaining the toolkit.
    </template>
  </VPTeamPageTitle>

  <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: -20px">
    <VPTeamMembers :members="members" />
  </div>
</VPTeamPage>

