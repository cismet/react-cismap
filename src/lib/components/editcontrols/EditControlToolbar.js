import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-toolbar';

import 'leaflet-toolbar/dist/leaflet.toolbar.css';
// import '@fortawesome/fontawesome-free/js/all.js';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;
		console.log('L.Toolbar2', L.Toolbar2);

		var ImmediateSubAction = L.Toolbar2.Action.extend({
			initialize: function(map, myAction) {
				this.map = map;
				this.myAction = myAction;
				L.Toolbar2.Action.prototype.initialize.call(this);
			},
			addHooks: function() {
				this.myAction.disable();
			}
		});
		var World = ImmediateSubAction.extend({
			options: {
				toolbarIcon: {
					html: 'World',
					tooltip: 'See the whole world'
				}
			},
			addHooks: function() {
				this.map.setView([ 0, 0 ], 0);
				ImmediateSubAction.prototype.addHooks.call(this);
			}
		});
		var Eiffel = ImmediateSubAction.extend({
			options: {
				toolbarIcon: {
					html: 'Eiffel Tower',
					tooltip: 'Go to the Eiffel Tower'
				}
			},
			addHooks: function() {
				this.map.setView([ 48.85815, 2.2942 ], 19);
				ImmediateSubAction.prototype.addHooks.call(this);
			}
		});
		var Cancel = ImmediateSubAction.extend({
			options: {
				toolbarIcon: {
					html: '<i class="fa fa-times"></i>',
					tooltip: 'Cancel'
				}
			}
		});
		var MyCustomAction = L.Toolbar2.Action.extend({
			options: {
				toolbarIcon: {
					className: 'fas fa-draw-polygon'
				},
				/* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
                 * by definition, contained inside another toolbar, so it
                 * doesn't need the additional styling and behavior of a
                 * L.Toolbar2.Control or L.Toolbar2.Popup.
                 */
				subToolbar: new L.Toolbar2({
					actions: [ World, Eiffel, Cancel ]
				})
			}
		});
		var MyCustomAction2 = L.Toolbar2.Action.extend({
			options: {
				toolbarIcon: {
					className: 'fas fa-draw-polygon'
				},
				/* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
                 * by definition, contained inside another toolbar, so it
                 * doesn't need the additional styling and behavior of a
                 * L.Toolbar2.Control or L.Toolbar2.Popup.
                 */
				subToolbar: new L.Toolbar2({
					actions: [ World, Eiffel, Cancel ]
				})
			}
		});

		const toolbar = new L.Toolbar2.Control({
			position: 'topright',
			actions: [ MyCustomAction, MyCustomAction2 ]
		});
		return toolbar;
	}
}

Control.propTypes = {
	position: PropTypes.string,
	onSelect: PropTypes.func,
	onFeatureCreation: PropTypes.func,
	onFeatureChange: PropTypes.func
};

Control.defaultProps = {
	position: 'topleft',
	onSelect: (editable) => {},
	onFeatureCreation: (editable) => {},
	onFeatureChange: (editable) => {}
};
