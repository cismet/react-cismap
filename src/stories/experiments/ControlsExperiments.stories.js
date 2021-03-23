import React from 'react';

export default {
	title: 'Storybook Testing/Controls'
};

export const ControlTester = (args) => (
	<div>
		<h3>ControlTester</h3>
	</div>
);
interface ControlTesterProps {
	/**
	 * Description for this prop.
	 * @default true
	 */
	enabled: boolean
}
ControlTester.args = {
	array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
	boolean: true,
	number: 0,
	numberAsRange: 0,
	objectAsJSON: { a: 0, b: 2, c: 'three' },
	enumAsRadio: 'first Option',
	enumAsInlineRadio: 'first Option',
	enumAsCheck: 'first Option',
	enumAsInlineCheck: 'first Option',
	enumAsSelect: 'first Option',
	enumAsMultiSelect: 'first Option',
	stringAsText: 'String',
	stringAsColor: '#ffffff',
	stringAsDate: '?'
};
// ControlTester.parameters = {
// 	docs: {
// 		source: {
// 			type: 'code'
// 		}
// 	}
// };
ControlTester.argTypes = {
	array: { control: { type: 'array', separator: '#' } },
	boolean: { control: { type: 'boolean' } },
	number: { control: { type: 'number' } },
	numberAsRange: { control: { type: 'range' } },
	objectAsJSON: { control: { type: 'object' } },
	enumAsRadio: {
		control: {
			type: 'radio',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	enumAsInlineRadio: {
		control: {
			type: 'inline-radio',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	enumAsCheck: {
		control: {
			type: 'check',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	enumAsInlineCheck: {
		control: {
			type: 'inline-check',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	enumAsSelect: {
		control: {
			type: 'select',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	enumAsMultiSelect: {
		control: {
			type: 'multi-select',
			options: [ 'first Option', 'second Option', 'third Option', 'fourth Option' ]
		}
	},
	stringAsText: { control: { type: 'text' } },
	stringAsColor: { control: { type: 'color' } },
	stringAsDate: { control: { type: 'date' } }
	// boolean	boolean	checkbox input	-
	// number	number	a numeric text box input	min, max, step
	// range	a range slider input	min, max, step
	// object	object	json editor text input	-
	// enum	radio	radio buttons input	options
	// inline-radio	inline radio buttons input	options
	// check	multi-select checkbox input	options
	// inline-check	multi-select inline checkbox input	options
	// select	select dropdown input	options
	// multi-select	multi-select dropdown input	options
	// string	text	simple text input	-
	// color	color picker input that assumes strings are color values	-
	// date	date picker input	-
};
