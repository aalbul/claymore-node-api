module.exports = {
    minimize: true,
    filename: {js: 'index.js'},
    hash: false,
    sourceMap: 'eval-source-map',
    extendWebpack(config) {
        config
            .target('node')
            .node.set('__dirname', false);
    }
};