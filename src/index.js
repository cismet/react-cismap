import React from 'react';
import ReactDOM from 'react-dom';

import 'leaflet/dist/leaflet.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { SimpleTopicMap } from './lib/_stories/complex/ToicMap.stories';
ReactDOM.render(
	<div>
		<SimpleTopicMap />
	</div>,
	document.getElementById('root')
);
