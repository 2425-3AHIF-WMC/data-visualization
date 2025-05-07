// next.config.js
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Fallback für process im Browser
            config.resolve.fallback = {
                ...config.resolve.fallback,
                process: require.resolve('process/browser'),
            };
            // globales process-Objekt bereitstellen
            config.plugins.push(
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                })
            );
        }
        return config;
    },
};
