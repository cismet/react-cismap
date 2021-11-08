import "react-bootstrap-typeahead/css/Typeahead.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "antd/dist/antd.css";
// import { withInfo } from '@storybook/addon-info';

// addDecorator(
// 	withInfo({
// 		header: false
// 	})
// );

export const parameters = {
  // controls: { expanded: true },
  controls: { hideNoControlsWarning: true },
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Mapping Components",
        "TopicMap Components",
        "Common Components",
        "Storybook Testing",
        "Deprecated",
      ],
    },
  },
};
