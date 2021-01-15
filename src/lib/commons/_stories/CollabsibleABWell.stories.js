import React, { useState } from 'react';
import CollapsibleABWell from '../CollapsibleABWell';
export default {
	title: 'Common Components/CollapsibleWells'
};

export const CollapsibleABWellsWithDefaultDivs = () => {
	const [ localMinified, setLocalMinify ] = useState(false);

	return (
		<div style={{ backgroundColor: 'white', padding: 0 }}>
			<CollapsibleABWell
				collapsed={localMinified}
				setCollapsed={setLocalMinify}
				keyToUse='k1'
			/>
		</div>
	);
};
