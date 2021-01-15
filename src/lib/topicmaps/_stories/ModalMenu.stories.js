import React, { useState, useRef, useEffect } from 'react';

import GenericModalApplicationMenu from '../../topicmaps/GenericModalApplicationMenu';
import GenericModalMenuSection from '../../topicmaps/GenericModalMenuSection';
import { storiesCategory } from './StoriesConf';

export default {
	title: storiesCategory + 'ModalMenu'
};
export const VerySimpleMenu = () => {
	const [ activeSectionKey, setActiveActionKey ] = useState('A');
	return (
		<GenericModalApplicationMenu
			height={500}
			visible={true}
			menuIntroduction={
				<span>
					Menu Introduction Menu Introduction Menu Introduction Menu Introduction Menu
					Introduction Menu Introduction
				</span>
			}
			menuTitle='Einstellungen und Kompaktanleitung'
			menuSections={[
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='A'
					sectionTitle='Section Content A (primary)'
					sectionBsStyle='primary'
					sectionContent={
						<div>
							Section Content A Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>,
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='B'
					sectionTitle='Section Content B (success)'
					sectionBsStyle='success'
					sectionContent={
						<div>
							Section Content B Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>,
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='C'
					sectionTitle='Section Content C (info)'
					sectionBsStyle='info'
					sectionContent={
						<div>
							Section Content C Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>,
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='D'
					sectionTitle='Section Content D (warning)'
					sectionBsStyle='warning'
					sectionContent={
						<div>
							Section Content D Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>,
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='E'
					sectionTitle='Section Content E (danger)'
					sectionBsStyle='danger'
					sectionContent={
						<div>
							Section Content E Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>,
				<GenericModalMenuSection
					activeSectionKey={activeSectionKey}
					setActiveSectionKey={setActiveActionKey}
					sectionKey='F'
					sectionTitle='Section Content F (default)'
					sectionBsStyle='default'
					sectionContent={
						<div>
							Section Content A Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content Section Content Section Content Section
							Content Section Content Section Content Section Content Section Content
							Section Content Section Content
						</div>
					}
				/>
			]}
			menuFooter={
				<span>
					Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer
					Footer{' '}
				</span>
			}
		/>
	);
};
// export const SingleInvertedGeoJSONInTheMap = () => <h3>Coming Soon</h3>;
