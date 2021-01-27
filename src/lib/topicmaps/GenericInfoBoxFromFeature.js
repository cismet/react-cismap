import React, { useContext } from 'react';
import InfoBox from './InfoBox';
import CismapContext from '../contexts/CismapContext';
import { getActionLinksForFeature } from '../tools/uiHelper';
import Icon from '../commons/Icon';
export const getColorForProperties = (props = { color: '#dddddd' }) => {
	return props.color;
};

const Component = (props) => {
	const { config } = props;
	const cismapContext = useContext(CismapContext);
	console.log('cismapContext in GenericInfoBox', cismapContext.selectedFeature);

	let currentFeature, items, featureCollection, next, prev;
	next = () => {};
	prev = () => {};
	if (cismapContext !== undefined) {
		currentFeature = cismapContext.selectedFeature;
		items = cismapContext.items || [];
		featureCollection = cismapContext.features || [];
	}
	let links = [];

	console.log('currentFeature', currentFeature);

	let header, title, subtitle, additionalInfo;
	if (currentFeature !== undefined) {
		links = getActionLinksForFeature(currentFeature, {
			entityClassName: config.navigator.noun.singular,
			displayZoomToFeature: true,
			zoomToFeature: () => {}, //TODO
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
	const fitAll = () => {};

	return (
		<InfoBox
			isCollapsible={currentFeature !== undefined}
			items={items} //?
			// selectedIndex={selectedIndex} //?
			showModalMenu={() => {}}
			colorize={getColorForProperties}
			pixelwidth={config.pixelwidth}
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
						<a onClick={fitAll}>
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
			next={() => {
				next();
			}}
			previous={() => {
				prev();
			}}
			hideNavigator={featureCollection.length <= 1}
			fitAll={fitAll}
		/>
	);
};

export default Component;
