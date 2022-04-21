import L from "leaflet";
import "leaflet.nontiledlayer";
import { GridLayer } from "react-leaflet";
import { isEqual, reduce } from "lodash";
import { EVENTS_RE } from "react-leaflet/lib/MapComponent";

class NonTiledWMSLayer extends GridLayer {
  createLeafletElement(props) {
    const { url, ...params } = props;
    const MyNonTiledLayer = L.NonTiledLayer.WMS.extend({
      bufferBounds: function (bounds) {
        const buffer = this.options.buffer || 0;
        // re-project to corresponding pixel bounds
        var nw_xy = this._map.latLngToContainerPoint(bounds.getNorthWest());
        var se_xy = this._map.latLngToContainerPoint(bounds.getSouthEast());

        // add a buffer to the pixel bounds
        var nw_px = nw_xy.subtract(new L.Point(buffer, buffer));
        var se_px = se_xy.add(new L.Point(buffer, buffer));

        // back to latlng bounds
        var nw_ll = this._map.containerPointToLatLng(nw_px);
        var se_ll = this._map.containerPointToLatLng(se_px);

        const newBounds = new L.LatLngBounds(nw_ll, se_ll);
        return newBounds;
      },
      _getClippedBounds: function () {
        var wgsBounds = this.bufferBounds(this._map.getBounds());

        // truncate bounds to valid wgs bounds
        var mSouth = wgsBounds.getSouth();
        var mNorth = wgsBounds.getNorth();
        var mWest = wgsBounds.getWest();
        var mEast = wgsBounds.getEast();

        var lSouth = this.options.bounds.getSouth();
        var lNorth = this.options.bounds.getNorth();
        var lWest = this.options.bounds.getWest();
        var lEast = this.options.bounds.getEast();

        //mWest = (mWest + 180) % 360 - 180;
        if (mSouth < lSouth) mSouth = lSouth;
        if (mNorth > lNorth) mNorth = lNorth;
        if (mWest < lWest) mWest = lWest;
        if (mEast > lEast) mEast = lEast;

        var world1 = new L.LatLng(mNorth, mWest);
        var world2 = new L.LatLng(mSouth, mEast);

        return new L.LatLngBounds(world1, world2);
      },
    });
    const layer = new MyNonTiledLayer(url, this.getOptions(params));
    return layer;
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);

    const { url: prevUrl, opacity: _po, zIndex: _pz, ...prevParams } = fromProps;
    const { url, opacity: _o, zIndex: _z, ...params } = toProps;

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url);
    }
    if (!isEqual(params, prevParams)) {
      this.leafletElement.setParams(params);
    }
  }

  getOptions(params) {
    return reduce(
      super.getOptions(params),
      (options, value, key) => {
        if (!EVENTS_RE.test(key)) {
          options[key] = value;
        }
        return options;
      },
      {}
    );
  }
}

export default NonTiledWMSLayer;
