const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			'/api/proxy': {
				target: 'https://api.foodics.dev/v5',
				changeOrigin: true,
				pathRewrite: { '^/api/proxy': '' },
			},
		},
	},
	css: {
		loaderOptions: {
			postcss: {
				postcssOptions: {
					plugins: [
						require('tailwindcss'),
						require('autoprefixer'),
					],
				},
			},
		},
	},
});
