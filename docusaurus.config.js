// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Data Visualisation Guide',
  tagline: 'Interactive learning resources for students',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://arcs-uflibraries.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/DataVisualisation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ARCS-UFLibraries', // Usually your GitHub org/user name.
  projectName: 'DataVisualisation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',

        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',

      docs: {
        sidebar: {
          hideable: true, 
          autoCollapseCategories: true,
        },
      },

      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Data Visualisation Guide',
        logo: {
          alt: 'ARCS UF Libraries',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Student Guide',
          },
          {
            to: '/docs/datasets',
            label: 'Datasets',
            position: 'left',
          },
          {
            to: '/docs/learning-resources',
            label: 'Learning Resources',
            position: 'left',
          },
          {
            to: '/docs/FAQs',
            label: 'FAQs',
            position: 'left',
          },
        ],
      },
        
      footer: {
        style: "dark",
        links: [
          {
            title: "Student Guide",
            items: [
              {
                label: "Getting Started",
                to: "/docs/getting-started",
              },
              {
                label: "Python Essentials",
                to: "/docs/python-essentials",
              },
              {
                label: "Working with Data",
                to: "/docs/working-with-data",
              },
              {
                label: "Data Visualization",
                to: "/docs/data-viz",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "Datasets",
                to: "/docs/datasets",
              },
              {
                label: "Learning Resources",
                to: "/docs/learning-resources",
              },
              {
                label: "FAQs",
                to: "/docs/FAQs",
              },
            ],
          },
          {
            title: "Project",
            items: [
              {
                label: "GitHub Repository",
                href: "https://github.com/ARCS-UFLibraries/DataVisualisation",
              },
              {
                label: "Report an Issue",
                href: "https://github.com/ARCS-UFLibraries/DataVisualisation/issues",
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Data Visualisation Guide • University of Florida Libraries`,
      },
    }),
};

export default config;
