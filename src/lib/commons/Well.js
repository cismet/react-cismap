import React from 'react';
// Since this component is simple and static, there's no parent container for it.
const Comp = (props) => {
	return (
		<div
			style={{
				minHeight: '20px',
				padding: '9px',
				marginBottom: '0px',
				backgroundColor: '#f5f5f5',
				border: '1px solid #e3e3e3',
				borderRadius: '4px',
				WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.05)',
				boxShadow: 'inset 0 1px 1px rgba(0,0,0,.05)',
				...props.style
			}}
		>
			{props.children}
		</div>
	);
};

export default Comp;
