import React from 'react';
import Icon from './Icon';

// Since this component is simple and static, there's no parent container for it.
const IconLink = ({ tooltip = null, href, target, onClick, iconname = "external-link-square", icon }) => {
	return (
		<a title={tooltip} href={href} onClick={onClick} target={target}>
			{icon || <Icon
				style={{ color: 'grey', width: '26px', textAlign: 'center' }}
				size='2x'
				name={iconname}
			/>}
		</a>
	);
};

export default IconLink;
