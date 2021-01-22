import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import Icon from './commons/Icon';
import { builtInGazetteerHitTrigger } from './tools/gazetteerHelper';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSun } from '@fortawesome/free-solid-svg-icons';

import Control from 'react-leaflet-control';
import { Form, FormGroup, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
console.log('InputGroup.Button', InputGroup.Button);

const COMP = ({
	mapRef,
	searchAfterGazetteer = false,
	searchInProgress = false,
	searchAllowed = false,
	searchIcon = <Icon name='search' />,
	overlayFeature = null,
	gazetteerHit = null,
	setGazetteerHit = () => {},
	searchButtonTrigger = () => {},
	setOverlayFeature = () => {},
	gazSearchMinLength = 2,
	enabled = true,
	placeholder = 'Geben Sie einen Suchbegriff ein',
	pixelwidth = 300,
	searchControlPosition = 'bottomleft',
	gazData = [],
	gazetteerHitAction = () => {},
	gazeteerHitTrigger,
	searchTooltipProvider = function() {
		return (
			<Tooltip
				style={{
					zIndex: 3000000000
				}}
				id='searchTooltip'
			>
				Objekte suchen
			</Tooltip>
		);
	},
	gazClearTooltipProvider = () => (
		<Tooltip
			style={{
				zIndex: 3000000000
			}}
			id='gazClearTooltip'
		>
			Suche zurücksetzen
		</Tooltip>
	),
	renderMenuItemChildren = (option, props, index) => {
		// console.log('option.glyph', option.glyph);
		// console.log('faSun', faSun);
		return (
			<div key={option.sorter}>
				<Icon
					style={{
						marginRight: '10px',
						width: '18px'
					}}
					name={option.glyph}
					overlay={option.overlay}
					size={'lg'}
				/>

				<span>{option.string}</span>
			</div>
		);
	}
}) => {
	const internalGazetteerHitTrigger = (hit) => {
		builtInGazetteerHitTrigger(
			hit,
			mapRef.current.leafletMap.leafletElement,
			setGazetteerHit,
			setOverlayFeature,
			gazeteerHitTrigger
		);
	};

	console.log('mapRef', mapRef);

	const typeaheadRef = useRef(null);
	const searchOverlay = useRef(null);
	const controlRef = useRef(null);
	useEffect(() => {
		if (controlRef.current !== null) {
			L.DomEvent.disableScrollPropagation(controlRef.current.leafletElement._container);
		}
	});

	const internalSearchButtonTrigger = (event) => {
		if (searchOverlay) {
			searchOverlay.current.hide();
		}
		if (searchInProgress === false && searchButtonTrigger !== undefined) {
			clear();
			setGazetteerHit(null);
			gazetteerHitAction(null);
			searchButtonTrigger(event);
		} else {
			//console.log("search in progress or no searchButtonTrigger defined");
		}
	};
	const internalClearButtonTrigger = (event) => {
		if (overlayFeature !== null) {
			setOverlayFeature(null);
		}

		clear();
		setGazetteerHit(null);
		gazetteerHitAction(null);
	};

	const clear = () => {
		typeaheadRef.current.clear();
	};
	let firstbutton;
	// check for overlayFeature and gazetteerHit because of the new behaviour to show the delete button always
	// if there is a gaz hit in the map
	// if (searchAfterGazetteer === true && overlayFeature === null && gazetteerHit === null) {
	// 	firstbutton = (
	// 		<InputGroup.Prepend
	// 			disabled={searchInProgress || !searchAllowed}
	// 			onClick={(e) => {
	// 				if (searchAllowed) {
	// 					internalSearchButtonTrigger(e);
	// 				} else {
	// 					// Hier kann noch eine Meldung angezeigt werden.
	// 				}
	// 			}}
	// 		>
	// 			<OverlayTrigger
	// 				ref={searchOverlay}
	// 				placement='top'
	// 				overlay={searchTooltipProvider()}
	// 			>
	// 				<Button
	// 					d
	// 					style={{ backgroundColor: 'grey', border: 0 }}
	// 					isabled={searchInProgress || !searchAllowed}
	// 				>
	// 					{searchIcon}
	// 				</Button>
	// 			</OverlayTrigger>
	// 		</InputGroup.Prepend>
	// 	);
	// } else {
	// 	// check for overlayFeature and gazetteerHit because of the new behaviour to show the delete button always
	// 	// if there is a gaz hit in the map
	// 	if (!searchAllowed || overlayFeature !== null || gazetteerHit !== null) {
	// 		firstbutton = (
	// 			<InputGroup.Prepend onClick={internalClearButtonTrigger}>
	// 				<OverlayTrigger
	// 					ref={(r) => (gazClearOverlayRef = r)} //{gazClearOverlayRef}
	// 					placement='top'
	// 					overlay={gazClearTooltipProvider()}
	// 				>
	// 					<Button
	// 						style={{ backgroundColor: 'grey', border: 0 }}
	// 						disabled={overlayFeature === null && gazetteerHit === null}
	// 					>
	// 						<Icon style={{ color: 'black' }} name='times' />
	// 					</Button>
	// 				</OverlayTrigger>
	// 			</InputGroup.Prepend>
	// 		);
	// 	}
	// }
	console.log('firstbutton', firstbutton);
	console.log('controlRef', controlRef);
	console.log('typeaheadRef', typeaheadRef);

	const buttonDisabled = overlayFeature === null && gazetteerHit === null;
	return (
		<Control
			ref={controlRef}
			pixelwidth={pixelwidth}
			position={searchControlPosition}
			style={{ outline: 0 }}
		>
			<Form
				style={{
					width: pixelwidth + 'px'
				}}
				action='#'
			>
				<FormGroup>
					<InputGroup>
						{/* {firstbutton} */}
						<InputGroup.Prepend onClick={internalClearButtonTrigger}>
							<OverlayTrigger
								placement='top'
								rootClose={true}
								overlay={gazClearTooltipProvider()}
							>
								<Button
									style={
										buttonDisabled === false ? (
											{
												backgroundImage:
													'linear-gradient(to bottom,#fff 0,#e0e0e0 100%)'
											}
										) : (
											{ backgroundColor: '#e0e0e0', borderColor: '#ffffff00' }
										)
									}
									//style={{ backgroundColor: 'grey', border: 0 }}
									disabled={buttonDisabled}
								>
									<Icon style={{ color: 'black' }} name='times' />
								</Button>
							</OverlayTrigger>
						</InputGroup.Prepend>
						<Typeahead
							id='haz-search-typeahead'
							ref={typeaheadRef}
							style={{ width: `${pixelwidth}px` }}
							labelKey='string'
							options={gazData}
							onChange={internalGazetteerHitTrigger}
							paginate={true}
							dropup={true}
							disabled={!enabled}
							placeholder={placeholder}
							minLength={gazSearchMinLength}
							filterBy={(option, props) => {
								return option.string
									.toLowerCase()
									.startsWith(props.text.toLowerCase());
							}}
							onInputChange={(text, event) => {}}
							align={'justify'}
							emptyLabel={'Keine Treffer gefunden'}
							paginationText={'Mehr Treffer anzeigen'}
							autoFocus={true}
							submitFormOnEnter={true}
							searchText={'suchen ...'}
							renderMenuItemChildren={renderMenuItemChildren}
						/>
					</InputGroup>
				</FormGroup>
			</Form>
		</Control>
	);
};

export default COMP;

COMP.propTypes = {
	enabled: PropTypes.bool,
	placeholder: PropTypes.string,
	pixelwidth: PropTypes.number,
	searchControlPosition: PropTypes.string,
	firstbutton: PropTypes.object,
	gazData: PropTypes.array,
	gazeteerHitTrigger: PropTypes.func,
	renderMenuItemChildren: PropTypes.func,
	gazClearTooltipProvider: PropTypes.func,
	gazSearchMinLength: PropTypes.number
};