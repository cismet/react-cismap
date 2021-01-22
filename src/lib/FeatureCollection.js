import React from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import { convertFeatureCollectionToMarkerPositionCollection } from './tools/mappingHelpers';

// Since this component is simple and static, there's no parent container for it.
const FC = ({ data, features }) => {
	return <div />;
};

export default FC;
