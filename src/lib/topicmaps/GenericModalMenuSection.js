import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Panel from '../commons/Panel';
import Card from 'react-bootstrap/Card';

const GenericModalMenuSection = ({
	sectionKey,
	sectionTitle,
	sectionBsStyle,
	sectionContent,
	// uiState,
	// uiStateActions,
	//new
	activeSectionKey,
	setActiveSectionKey = () => {}
}) => {
	console.log('sectionKey', sectionKey);
	console.log('activeSectionKey', activeSectionKey);

	return (
		<Accordion
			key={sectionKey + '.' + activeSectionKey}
			name={sectionKey}
			style={{ marginBottom: 6 }}
			defaultActiveKey={activeSectionKey || sectionKey}
			onSelect={() => {
				if (activeSectionKey === sectionKey) {
					console.log('onSelect', "					setActiveSectionKey('none')        ");

					setActiveSectionKey('none');
				} else {
					console.log(
						'onSelect',
						"					setActiveSectionKey('" + sectionKey + "')        "
					);
					setActiveSectionKey(sectionKey);
				}
			}}
		>
			{/* <Card>
				<Card.Header>
					<Accordion.Toggle as={Button} variant='link' eventKey={sectionKey}>
						{sectionTitle}
					</Accordion.Toggle>
				</Card.Header>
				<Accordion.Collapse eventKey={sectionKey}>
					<Card.Body>{sectionContent}</Card.Body>
				</Accordion.Collapse>
			</Card> */}

			<Panel header={sectionTitle} eventKey={sectionKey} bsStyle={sectionBsStyle}>
				{sectionContent}
			</Panel>
		</Accordion>
	);
};
export default GenericModalMenuSection;
