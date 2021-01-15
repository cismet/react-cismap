import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
export default {
	title: 'Storybook Testing/Bootstrap'
};

export const TestButton = () => (
	<div>
		<div>
			<Button variant='primary'>Primary</Button>{' '}
			<Button variant='secondary'>Secondary</Button>{' '}
			<Button variant='success'>Success</Button> <Button variant='warning'>Warning</Button>{' '}
			<Button variant='danger'>Danger</Button> <Button variant='info'>Info</Button>{' '}
			<Button variant='light'>Light</Button> <Button variant='dark'>Dark</Button>{' '}
			<Button variant='link'>Link</Button>
		</div>
		<div>
			<div>
				<h1>
					Example heading <Badge variant='secondary'>New</Badge>
				</h1>
				<h2>
					Example heading <Badge variant='secondary'>New</Badge>
				</h2>
				<h3>
					Example heading <Badge variant='secondary'>New</Badge>
				</h3>
				<h4>
					Example heading <Badge variant='secondary'>New</Badge>
				</h4>
				<h5>
					Example heading <Badge variant='secondary'>New</Badge>
				</h5>
				<h6>
					Example heading <Badge variant='secondary'>New</Badge>
				</h6>
			</div>
		</div>
	</div>
);
