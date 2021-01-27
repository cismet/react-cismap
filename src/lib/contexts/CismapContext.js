import React from 'react';

const defaultValue = {
	boundingBox: undefined,
	location: undefined,
	routedMapRef: undefined,
	items: undefined,
	setItems: undefined, //function
	selectedFeature: undefined,
	setSelectedFeature: undefined //function
};

const CismapContext = React.createContext(undefined);
export default CismapContext;
