import React, { useContext } from 'react';
import InfoBox from './InfoBox';
import CismapContext from '../contexts/CismapContext';
import { getActionLinksForFeature } from '../tools/uiHelper';
import Icon from '../commons/Icon';
import { FeatureCollectionContext } from '../contexts/FeatureCollectionContextProvider';
import { TMDispatchContext } from '../contexts/TopicMapContextProvider';
export const getColorForProperties = (props = { color: '#dddddd' }) => {
	return props.color;
};

const Component = (props) => {
	const { config, pixelwidth } = props;
	const featureCollectionContext = useContext(FeatureCollectionContext);
	const { zoomToFeature, gotoHome } = useContext(TMDispatchContext);
	const { shownFeatures = [], selectedFeature, items = [] } = featureCollectionContext;

	let currentFeature, featureCollection;

	if (featureCollectionContext !== undefined) {
		currentFeature = selectedFeature;
		featureCollection = shownFeatures || [];
	}
	let links = [];

	let header, title, subtitle, additionalInfo;
	if (currentFeature !== undefined) {
		links = getActionLinksForFeature(currentFeature, {
			entityClassName: config.navigator.noun.singular,
			displayZoomToFeature: true,
			zoomToFeature,
			displaySecondaryInfoAction:
				config.displaySecondaryInfoAction === true ||
				config.displaySecondaryInfoAction === undefined,
			setVisibleStateOfSecondaryInfo: (vis) => this.setState({ secondaryInfoVisible: vis })
		});
		header = <span>{currentFeature.properties.info.header || config.header}</span>;
		title = currentFeature.properties.info.title;
		subtitle = currentFeature.properties.info.subtitle;
		additionalInfo = currentFeature.properties.info.additionalInfo;
	}
	const headerColor = getColorForProperties((currentFeature || {}).properties);

	const minified = undefined;
	const minify = undefined;

	//TODO

	return (
		<InfoBox
			isCollapsible={currentFeature !== undefined}
			items={items} //?
			// selectedIndex={selectedIndex} //?
			showModalMenu={() => {}}
			colorize={getColorForProperties}
			pixelwidth={pixelwidth}
			header={header}
			// headerColor={headerColor}
			links={links}
			title={title}
			subtitle={subtitle}
			additionalInfo={additionalInfo}
			zoomToAllLabel={`${items.length} ${items.length === 1
				? config.navigator.noun.singular
				: config.navigator.noun.plural} in ${config.city}`}
			currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length === 1
				? config.navigator.noun.singular
				: config.navigator.noun.plural} angezeigt`}
			collapsedInfoBox={minified}
			setCollapsedInfoBox={minify}
			noCurrentFeatureTitle={<h5>{config.noFeatureTitle}</h5>}
			noCurrentFeatureContent={
				<div style={{ marginRight: 9 }}>
					{(config.noCurrentFeatureContent === undefined ||
						config.noCurrentFeatureContent === '') && (
						<p>
							Für mehr {config.navigator.noun.plural} Ansicht mit{' '}
							<Icon name='minus-square' /> verkleinern oder mit dem untenstehenden
							Link alle {config.navigator.noun.plural} anzeigen.
						</p>
					)}
					{config.noCurrentFeatureContent !== undefined &&
					config.noCurrentFeatureContent !== '' && (
						<p>{config.noCurrentFeatureContent}</p>
					)}

					<div align='center'>
						<a
							className='pleaseRenderLikeALinkEvenWithoutAnHrefAttribute'
							onClick={gotoHome}
						>
							{items.length}{' '}
							{items.length === 1 ? (
								config.navigator.noun.singular
							) : (
								config.navigator.noun.plural
							)}{' '}
							in {config.city}
						</a>
					</div>
				</div>
			}
			hideNavigator={featureCollection.length <= 1}
			fitAll={gotoHome}
		/>
	);
};

export default Component;
