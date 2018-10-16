import React from 'react';
import Layers from '../constants/layers';
import { namedStyles } from '../constants/layers';
import objectAssign from 'object-assign';

export default function getLayers(
	layerString,
	namedMapStyle = 'default',
	config = {
		layerSeparator: '|'
	},
	namedStylesConfig = namedStyles
) {
	const layerArr = layerString.split(config.layerSeparator || '|');
	let namedMapStyleExtension = namedMapStyle;
	if (namedMapStyleExtension === null || namedMapStyleExtension === '') {
		namedMapStyleExtension = 'default';
	}
	namedMapStyleExtension = '.' + namedMapStyleExtension;
	const getLayer = (layerWithNamedStyleExtension, options = {}) => {
		const layerAndNamedStyleArray = layerWithNamedStyleExtension.split('.');
		let namedStyleOptions = {};


    if (layerAndNamedStyleArray.length > 1) {
			//the last named style is overriding the ones before
      let first=true;
      for (const element of layerAndNamedStyleArray) {
        if (first){
          first=false;
        }
        else {
          namedStyleOptions = objectAssign({}, namedStyleOptions, namedStylesConfig[element]); 
        }
      }
		}
		let mergedOptions = objectAssign({}, namedStyleOptions, options);
		const layerGetter = Layers.get(layerAndNamedStyleArray[0]);
		if (layerGetter) {
			return layerGetter(mergedOptions);
		} else {
			return null;
		}
	};

	return (
		<div>
			{layerArr.map((layerWithOptions) => {
				const layOp = layerWithOptions.split('@');
				if (!isNaN(parseInt(layOp[1], 10))) {
					const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;

					const layerOptions = {
						opacity: parseInt(layOp[1] || '100', 10) / 100.0
					};
					return getLayer(layerWithNamedStyleExtension, layerOptions);
				}
				if (layOp.length === 2) {
					try {
						let layerOptions = JSON.parse(layOp[1]);
						let layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
						return getLayer(layerWithNamedStyleExtension, layerOptions);
					} catch (error) {
						console.error(error);
						console.error(
							'Problems during parsing of the layer options. Skip options. You will get the 100% Layer:' +
								layOp[0]
						);
						const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
						return getLayer(layerWithNamedStyleExtension);
					}
				} else {
					const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
					return getLayer(layerWithNamedStyleExtension);
				}
			})}
		</div>
	);
}
