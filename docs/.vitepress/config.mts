import { defineConfig } from 'vitepress'

async function getPackageVersion() {
  const response = await fetch('https://registry.npmjs.org/wal-dev'); //
  const data = await response.json();
  return data['dist-tags'].latest;
}
const pkgVersion = await getPackageVersion();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "wal-dev",
  description: "wal-dev | npm package - Quick start toolkit for Walrus.",
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: 'https://github.com/nidz-the-fact/wal-dev/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },


    nav: [
      // { text: 'Home', link: '/' },
      {
        text: pkgVersion,
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/nidz-the-fact/wal-dev/tree/main/docs/CHANGELOG.md',
          },
          {
            text: 'Issuessions',
            link: 'https://github.com/nidz-the-fact/wal-dev/issues',
          },
          {
            text: 'Pullssions',
            link: 'https://github.com/nidz-the-fact/wal-dev/pulls',
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/nidz-the-fact/wal-dev/releases',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/nidz-the-fact/wal-dev',
          },
        ],
      },

    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Get started', link: '/' },
          { text: 'Contributing', link: '/contributing' },
        ]
      },
      {
        text: 'Features',
        items: [
          {
            text: 'Commands', link: '/commands/commands',
            collapsed: true, // true
            items: [
              {
                text: 'wal balance',
                link: '/commands/wal-balance',
              },
              {
                text: 'wal get',
                link: '/commands/wal-get',
              },
              {
                text: 'wal upload',
                link: '/commands/wal-upload',
              },
            ],
          },


        ],
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nidz-the-fact/wal-dev' }
    ]
  }
})
