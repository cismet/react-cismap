import React from 'react';
import Icon, { nameMap as allIconNamesMap } from '../Icon';
import Table from 'react-bootstrap/Table';
export default {
	title: 'Common Components/Icons'
};
console.log('allIconNamesMap', allIconNamesMap);

export const AllIcons = () => (
	<Table striped bordered hover>
		<thead>
			<tr>
				<th>Name</th>
				<th>Icon</th>
			</tr>
		</thead>
		<tbody>
			{Object.keys(allIconNamesMap).map((key, index) => {
				return (
					<tr key={'iconrow-' + index}>
						<td>{key}</td>
						<td>
							<Icon name={key} />
						</td>
					</tr>
				);
			})}
		</tbody>
	</Table>
);
