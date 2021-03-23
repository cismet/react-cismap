import React, { useState } from 'react';
import IconLink from '../IconLink';
import IconLinkFA from '../IconLinkFA';
import SimpleLinkButton from '../SimpleLinkButton';
import { faChild } from '@fortawesome/free-solid-svg-icons';
export default {
	title: 'Common Components/Links'
};

export const IconLinkWithNoParameters = () => {
	return (
		<div style={{ backgroundColor: 'white', padding: 10 }}>
			<IconLink />
			{/* <IconLink tooltip='Tooltip' href='https:/cismet.de' target='_blank' iconname='car' /> */}
		</div>
	);
};

export const IconLinkWithAllParametersSet = () => {
	return (
		<div style={{ backgroundColor: 'white', padding: 10 }}>
			<IconLink tooltip='Tooltip' href='https:/cismet.de' target='_blank' iconname='info' />
		</div>
	);
};
export const IconLinkFAWithAllParametersSet = () => {
	return (
		<div style={{ backgroundColor: 'white', padding: 10 }}>
			<IconLinkFA tooltip='Tooltip' href='https:/cismet.de' target='_blank' icon={faChild} />
		</div>
	);
};

export const SimpleLinkButtonWithAlert = () => {
	const text =
		'Looks like a Link. Works like a Button. Avoids linting warning jsx-a11y/anchor-is-valid';
	return (
		<div style={{ backgroundColor: 'white', padding: 10 }}>
			<SimpleLinkButton
				title='Tooltip'
				onClick={() => {
					window.alert(text);
				}}
			>
				{text}
			</SimpleLinkButton>
		</div>
	);
};
