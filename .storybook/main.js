// module.exports = {
// 	// stories: [ '../**/*.stories.js' ],
// 	stories: [ '../src/lib/**/*.stories.js' ],

// 	addons: [
// 		'@storybook/preset-create-react-app',
// 		'@storybook/addon-knobs',
// 		'@storybook/addon-actions',
// 		'@storybook/addon-links'
// 	],
// 	webpackFinal: (webpackConfig) => {
// 		const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
// 			({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
// 		);

// 		webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
// 		return webpackConfig;
// 	}
// };

module.exports = {
	stories: [ '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)' ],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/preset-create-react-app',
		'@storybook/addon-knobs',
		// '@storybook/addon-info',
		'@storybook/addon-docs',
		'@storybook/addon-actions'
	],
	webpackFinal: (webpackConfig) => {
		const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
			({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
		);

		webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
		return webpackConfig;
	}
};
