import React, { useState } from 'react';
import CollapsibleWell from '../CollapsibleWell';
export default {
	title: 'Common Components/CollapsibleWells'
};

export const CollapsibleWellWithDefaultDivs = () => {
	const [ localMinified, setLocalMinify ] = useState(false);

	return (
		<div style={{ backgroundColor: 'white', padding: 0 }}>
			<CollapsibleWell
				collapsed={localMinified}
				setCollapsed={setLocalMinify}
				keyToUse='k1'
			/>
		</div>
	);
};
