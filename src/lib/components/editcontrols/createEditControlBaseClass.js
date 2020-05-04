import L from 'leaflet';
import { watch, unwatch, callWatchers } from 'watchjs';

export function createEditControlBaseClass() {
	L.EditControl = L.Control.extend({
		options: {
			position: 'topleft',
			callback: null,
			kind: '',
			html: '',
			onSelect: undefined
		},

		onAdd: function(map) {
			var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
				link = L.DomUtil.create('a', '', container);

			link.href = '#';

			if (this.options.tooltip === undefined) {
				link.title = this.options.kind + ' anlegen';
			} else {
				link.title = this.options.tooltip;
			}

			link.innerHTML = this.options.html;

			//Demo for proper Toolbar Styling
			// var link2 = L.DomUtil.create('a', '', container);
			// link2.href = '#';
			// link2.title = 'Create a new ' + this.options.kind;
			// link2.innerHTML = this.options.html;
			L.DomEvent.disableClickPropagation(link);

			if (map.editTools.mode === undefined) {
				map.editTools.mode = {
					name: undefined,
					locked: false,
					callback: null
				};
			}
			console.log('map.editTools.mode.name:', map.editTools.mode.name);
			watch(map.editTools.mode, 'name', () => {
				if (map.editTools.mode.name === this.options.kind) {
					link.innerHTML = `<span style="padding:2px; padding-right:4px; padding-left:4px; border-radius:4px; border: 3px solid #008AFA;" >
									${this.options.html}
								 </span>`;
				} else {
					link.innerHTML = this.options.html;
				}
			});

			L.DomEvent.on(link, 'click', L.DomEvent.stop).on(
				link,
				'click',
				function(e) {
					console.log('click on button ' + this.options.kind);
					if (this.options.onSelect !== undefined) {
						this.options.onSelect();
					}

					if (map.editTools.mode.name !== this.options.kind) {
						map.editTools.stopDrawing();
						map.editTools.mode.name = this.options.kind;
						map.editTools.validClicks = 0;
						map.editTools.mode.callback = this.options.callback;
						window.LAYER = this.options.callback.call(map.editTools);
					} else {
						map.editTools.validClicks = 0;
						map.editTools.stopDrawing();
						//if (map.editTools.mode.locked === false) {
						map.editTools.mode.name = undefined;
						//}
					}
				},
				this
			);

			return container;
		}
	});
}
