import Icon from "../commons/Icon";
import queryString from "query-string";
import React from "react";

export const triggerLightBoxForFeature = ({
  currentFeature,
  getPhotoUrl,
  getPhotoSeriesUrl,
  getPhotoSeriesArray = () => {},
  urlManipulation = (input) => input,
  lightBoxDispatchContext,
  captionFactory = (linkUrl) => (
    <a href="https://www.wuppertal.de/service/impressum.php" target="_impressum">
      <Icon name="copyright" /> Stadt Wuppertal
    </a>
  ),
  fallbackLinkUrl = "http://www.fotokraemer-wuppertal.de/",
  harvester = (data) => {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = data;
    let urls = [];
    let counter = 0;
    let mainfotoname = decodeURIComponent(currentFeature.properties.foto).split("/").pop().trim();
    let selectionWish = 0;
    for (let el of tmp.getElementsByClassName("bilderrahmen")) {
      let query = queryString.parse(el.getElementsByTagName("a")[0].getAttribute("href"));
      urls.push("https://wunda-geoportal-fotos.cismet.de/images/" + query.dateiname_bild);
      if (mainfotoname === query.dateiname_bild) {
        selectionWish = counter;
      }
      counter += 1;
    }
    return { urls, selectionWish };
  },
}) => {
  const photoUrl = urlManipulation(getPhotoUrl(currentFeature));
  const photoSeriesUrl = urlManipulation(getPhotoSeriesUrl(currentFeature));
  const photoSeriesPhotoUrls = getPhotoSeriesArray(currentFeature);

  if (
    photoSeriesPhotoUrls !== undefined &&
    photoSeriesPhotoUrls.length !== undefined &&
    photoSeriesPhotoUrls.length > 0
  ) {
    lightBoxDispatchContext.setAll({
      title: currentFeature.text,
      photourls: photoSeriesPhotoUrls,
      caption: captionFactory(currentFeature.text),
      index: 0,
    });
  } else if (
    photoSeriesUrl === undefined ||
    photoSeriesUrl === null ||
    photoSeriesUrl.indexOf("&noparse") !== -1
  ) {
    let linkUrl;
    if (photoSeriesUrl) {
      linkUrl = photoSeriesUrl;
    } else {
      linkUrl = fallbackLinkUrl;
      lightBoxDispatchContext.setAll({
        title: currentFeature.text,
        photourls: [photoUrl],
        caption: captionFactory(linkUrl),
        index: 0,
      });
    }
  } else {
    fetch(photoSeriesUrl, {
      method: "get",
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        const { urls, selectionWish } = harvester(data);
        lightBoxDispatchContext.setAll({
          title: currentFeature.text,
          photourls: urls,
          caption: captionFactory(photoSeriesUrl),
          index: selectionWish,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
};

export const getLinkOrText = (input) => {
  if (input !== undefined && input !== null) {
    if (input.startsWith("https://") || input.startsWith("http://")) {
      return (
        <a href={input} target="_more">
          siehe externe Webseite
        </a>
      );
    } else {
      return <span>{input}</span>;
    }
  }
};

export const fotoKraemerUrlManipulation = (input) => {
  if (input !== undefined || input === "") {
    const ret = input.replace(
      /https*:\/\/.*fotokraemer-wuppertal\.de/,
      "https://wunda-geoportal-fotos.cismet.de/"
    );
    // console.log('converted url from ', input);
    // console.log('converted url to ', ret);
    return ret;
  } else {
    return undefined;
  }
};

export const fotoKraemerCaptionFactory = (linkUrl) => (
  <a href={linkUrl} target="_fotos">
    <Icon name="copyright" /> Peter Kr&auml;mer - Fotografie
  </a>
);
