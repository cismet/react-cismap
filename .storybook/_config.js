import { configure } from '@storybook/react';
const req = require.context('../src/', true, /\.stories\.js$/);

function loadStories() {
	req.keys().forEach((path) => req(path));
}
configure(loadStories, module);
