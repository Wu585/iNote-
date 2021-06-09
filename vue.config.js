module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/iNote-website/'
        : '/',
    lintOnSave: false,
    devServer: {
        https: true
    }
}
