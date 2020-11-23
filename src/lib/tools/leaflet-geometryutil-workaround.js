import L from 'leaflet';
import 'leaflet-snap';
import 'leaflet-geometryutil';
import 'proj4leaflet';

export function overrideClosestFromGeometryUtils() {
	L.GeometryUtil.closest = (map, layer, latlng, vertices) => {
		var latlngs,
			mindist = Infinity,
			result = null,
			i,
			n,
			distance,
			subResult;

		if (layer instanceof Array) {
			// if layer is Array<Array<T>>
			if (layer[0] instanceof Array && typeof layer[0][0] !== 'number') {
				// if we have nested arrays, we calc the closest for each array
				// recursive
				for (i = 0; i < layer.length; i++) {
					subResult = L.GeometryUtil.closest(map, layer[i], latlng, vertices);
					if (subResult && subResult.distance < mindist) {
						mindist = subResult.distance;
						result = subResult;
					}
				}
				return result;
			} else if (
				layer[0] instanceof L.LatLng ||
				typeof layer[0][0] === 'number' ||
				typeof layer[0].lat === 'number'
			) {
				// we could have a latlng as [x,y] with x & y numbers or {lat, lng}
				layer = L.polyline(layer);
			} else {
				return result;
			}
		}

		// if we don't have here a Polyline, that means layer is incorrect
		// see https://github.com/makinacorpus/Leaflet.GeometryUtil/issues/23
		if (!(layer instanceof L.Polyline)) return result;

		// deep copy of latlngs
		// workaround by helllth
		// see https://github.com/makinacorpus/Leaflet.GeometryUtil/issues/59
		function deepClone(arr) {
			var len = arr.length;
			var newArr = new Array(len);
			for (var i = 0; i < len; i++) {
				if (Array.isArray(arr[i]) && !(arr[i] instanceof L.LatLng))
					newArr[i] = deepClone(arr[i]);
				else newArr[i] = arr[i].clone();
			}
			return newArr;
		}
		latlngs = deepClone(layer.getLatLngs().slice(0));

		//	latlngs = JSON.parse(JSON.stringify(layer.getLatLngs().slice(0)));

		// add the last segment for L.Polygon
		if (layer instanceof L.Polygon) {
			// add the last segment for each child that is a nested array
			var addLastSegment = function(latlngs) {
				if (L.Polyline._flat(latlngs)) {
					latlngs.push(latlngs[0]);
				} else {
					for (var i = 0; i < latlngs.length; i++) {
						addLastSegment(latlngs[i]);
					}
				}
			};
			addLastSegment(latlngs);
		}

		// we have a multi polygon / multi polyline / polygon with holes
		// use recursive to explore and return the good result
		if (!L.Polyline._flat(latlngs)) {
			for (i = 0; i < latlngs.length; i++) {
				// if we are at the lower level, and if we have a L.Polygon, we add the last segment
				subResult = L.GeometryUtil.closest(map, latlngs[i], latlng, vertices);
				if (subResult.distance < mindist) {
					mindist = subResult.distance;
					result = subResult;
				}
			}
			return result;
		} else {
			// Lookup vertices
			if (vertices) {
				for (i = 0, n = latlngs.length; i < n; i++) {
					var ll = latlngs[i];
					distance = L.GeometryUtil.distance(map, latlng, ll);
					if (distance < mindist) {
						mindist = distance;
						result = ll;
						result.distance = distance;
					}
				}
				return result;
			}

			// Keep the closest point of all segments
			for (i = 0, n = latlngs.length; i < n - 1; i++) {
				var latlngA = latlngs[i],
					latlngB = latlngs[i + 1];
				distance = L.GeometryUtil.distanceSegment(map, latlng, latlngA, latlngB);
				if (distance <= mindist) {
					mindist = distance;
					result = L.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB);
					result.distance = distance;
				}
			}
			return result;
		}
	};
}
