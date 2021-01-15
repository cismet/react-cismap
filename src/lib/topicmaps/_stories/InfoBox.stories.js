import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import { RoutedMap, MappingConstants } from '../..';

export default {
	title: storiesCategory + 'InfoBox'
};

const mapStyle = {
	height: 600,
	cursor: 'pointer'
};

export const SimpleInfoBox = () => <h3>Coming Soon</h3>;
