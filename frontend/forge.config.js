const path = require('path');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

// import the WebpackPlugin class directly:
const WebpackPlugin = require('@electron-forge/plugin-webpack').default;
const AutoUnpack = require('@electron-forge/plugin-auto-unpack-natives').default;
const FusesPlugin = require('@electron-forge/plugin-fuses').default;

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
    { name: '@electron-forge/maker-deb', config: {} },
    { name: '@electron-forge/maker-rpm', config: {} },
  ],
  entryPoints: [
    {
      html: './src/index.html',
      js: './src/renderer.js',
      name: 'main',
    },
  ],
  plugins: [
    // 1) actual instance of WebpackPlugin
    new WebpackPlugin({
      mainConfig: path.resolve(__dirname, 'webpack.main.config.js'),
      renderer: {
        config: path.resolve(__dirname, 'webpack.renderer.config.js'),
        entryPoints: [
          {
            html: path.resolve(__dirname, 'src/index.html'),
            js: path.resolve(__dirname, 'src/renderer.js'),
            name: 'main',
          },
        ],
      },
    }),

    // 2) actual instance of AutoUnpack
    new AutoUnpack({}),

    // 3) actual instance of FusesPlugin
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

