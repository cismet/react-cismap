import Icon from '../commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
// import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

const GenericModalApplicationMenu = ({
	menuIcon,
	menuTitle,
	menuIntroduction,
	menuSections,
	menuFooter,

	//new
	height,
	width,
	visible,
	setVisible = () => {},
	activeSectionKey
}) => {
	const close = () => {
		setVisible(false);
	};

	const modalBodyStyle = {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: height
	};

	return (
		<Modal
			style={{
				zIndex: 3000000000
			}}
			height='100%'
			size='xl'
			show={visible}
			onHide={close}
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title>
					<Icon name={menuIcon} /> {menuTitle}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={modalBodyStyle} id='myMenu' key={activeSectionKey}>
				<div style={{ marginBottom: 5 }}>{menuIntroduction}</div>
				{menuSections}
			</Modal.Body>
			<Modal.Footer>
				<table
					style={{
						width: '100%'
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'left',
									verticalAlign: 'top',
									paddingRight: '30px'
								}}
							>
								{menuFooter}
							</td>
							<td>
								<Button
									id='cmdCloseModalApplicationMenu'
									bsStyle='primary'
									type='submit'
									onClick={close}
								>
									Ok
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</Modal.Footer>
		</Modal>
	);
};

export default GenericModalApplicationMenu;
GenericModalApplicationMenu.propTypes = {
	menuIcon: PropTypes.string,
	menuTitle: PropTypes.string,
	menuIntroduction: PropTypes.object,
	menuSections: PropTypes.array,
	menuFooter: PropTypes.object,

	uiStateActions: PropTypes.object,
	uiState: PropTypes.object,
	kitasState: PropTypes.object,
	kitasActions: PropTypes.object,
	mappingState: PropTypes.object,
	mappingActions: PropTypes.object
};

GenericModalApplicationMenu.defaultProps = {
	menuIcon: 'bars',
	menuTitle: 'Einstellungen und Hilfe',
	menuSections: [],
	menuFooter: (
		<div>
			<b>react-cismap</b> (
			<a href='https://cismet.de/' target='_cismet'>
				cismet GmbH
			</a>{' '}
			auf Basis von{' '}
			<a href='http://leafletjs.com/' target='_more'>
				Leaflet
			</a>{' '}
			und{' '}
			<a href='https://cismet.de/#refs' target='_cismet'>
				cids | WuNDa
			</a>{' '}
			|{' '}
			<a
				target='_blank'
				rel='noopener noreferrer'
				href='https://cismet.de/datenschutzerklaerung.html'
			>
				Datenschutzerklärung (Privacy Policy)
			</a>
		</div>
	)
};
