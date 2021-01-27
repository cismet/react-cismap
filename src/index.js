import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

import './index.css';
import { SimpleTopicMap } from './lib/_stories/complex/TopicMap.stories';

const TestContext = React.createContext();

const ContextDisplay = () => {
	const testContextValue = useContext(TestContext);
	return (
		<div
			onClick={() => {
				if (testContextValue !== undefined) {
					testContextValue.setCounter((old) => old + 1);
				}
			}}
		>
			{(testContextValue || {}).counter}
		</div>
	);
};

const TestComponent = ({ display }) => {
	const [ counter, setCounter ] = useState(0);
	return (
		<TestContext.Provider value={{ counter, setCounter }}>
			<h1>Test</h1>
			<h5>{display}</h5>
			{/* <h5>
				<ContextDisplay />
			</h5> */}
		</TestContext.Provider>
	);
};

ReactDOM.render(
	<div>
		<SimpleTopicMap />
		{/* <TestComponent display={<ContextDisplay />} /> */}
	</div>,
	document.getElementById('root')
);
