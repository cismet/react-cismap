/*
 * 🍂class ImageOverlay.Rotated
 * 🍂inherits ImageOverlay
 *
 * Like `ImageOverlay`, but rotates and skews the image. This is done by using
 * *three* control points instead of *two*.
 *
 * @example
 *
 * ```
 * var topleft    = L.latLng(40.52256691873593, -3.7743186950683594),
 * 	topright   = L.latLng(40.5210255066156, -3.7734764814376835),
 * 	bottomleft = L.latLng(40.52180437272552, -3.7768453359603886);
 *
 * var overlay = L.imageOverlay.rotated("./palacio.jpg", topleft, topright, bottomleft, {
 * 	opacity: 0.4,
 * 	interactive: true,
 * 	attribution: "&copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
 * });
 * ```
 *
 */

import L, { DomUtil } from "leaflet";
import { LatLngBounds } from "leaflet";
const toLatLngBounds = (a, b) => {
  if (a instanceof LatLngBounds) {
    return a;
  }
  return new LatLngBounds(a, b);
};
const OwnImageOverlay = L.ImageOverlay.extend({
  initialize: function (image, bounds, options) {
    if (typeof image === "string") {
      this._url = image;
    } else {
      // Assume that the first parameter is an instance of HTMLImage or HTMLCanvas
      this._rawImage = image;
    }

    this._bounds = toLatLngBounds(bounds);

    L.setOptions(this, options);
  },

  _initImage: function () {
    var img = this._rawImage;
    if (this._url) {
      img = L.DomUtil.create("img");
      img.style.display = "none"; // Hide while the first transform (zero or one frames) is being done

      if (this.options.crossOrigin) {
        img.crossOrigin = "";
      }

      img.src = this._url;
      this._rawImage = img;
    }
    L.DomUtil.addClass(img, "leaflet-image-layer");

    // this._image is reused by some of the methods of the parent class and
    // must keep the name, even if it is counter-intuitive.
    var div = (this._image = L.DomUtil.create(
      "div",
      "leaflet-image-layer " + (this._zoomAnimated ? "leaflet-zoom-animated" : "")
    ));

    this._updateZIndex(); // apply z-index style setting to the div (if defined)

    div.appendChild(img);

    div.onselectstart = L.Util.falseFn;
    div.onmousemove = L.Util.falseFn;

    img.onload = function () {
      this._reset();
      img.style.display = "block";
      this.fire("load");
    }.bind(this);

    img.alt = this.options.alt;
  },

  setUrl: function (url) {
    this._url = url;

    if (this._rawImage) {
      this._rawImage.src = url;
    }
    return this;
  },
});

/* 🍂factory imageOverlay.rotated(imageUrl: String|HTMLImageElement|HTMLCanvasElement, topleft: LatLng, topright: LatLng, bottomleft: LatLng, options?: ImageOverlay options)
 * Instantiates a rotated/skewed image overlay, given the image URL and
 * the `LatLng`s of three of its corners.
 *
 * Alternatively to specifying the URL of the image, an existing instance of `HTMLImageElement`
 * or `HTMLCanvasElement` can be used.
 */
L.imageOverlay.rotated = function (imgSrc, topleft, topright, bottomleft, options) {
  return new L.ImageOverlay.Rotated(imgSrc, topleft, topright, bottomleft, options);
};

export default OwnImageOverlay;
