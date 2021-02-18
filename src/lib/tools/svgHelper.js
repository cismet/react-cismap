export const DEFAULT_SVG = {
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="311.668" height="311.668">
<path class="bg-fill" fill="#C32D6A"  d="M0-.661h313.631v313.63H0z"/>
<path class="fg-fill" fill="#FFF"  d="M292.827 156.794c0 18.76-3.584 36.451-10.733 53.095-7.187 16.681-16.929 31.17-29.302 43.523-12.354 12.392-26.88 22.152-43.523 29.302s-34.335 10.733-53.094 10.733c-18.74 0-36.432-3.584-53.104-10.733-16.653-7.149-31.17-16.91-43.533-29.302-12.354-12.354-22.125-26.843-29.273-43.523-7.159-16.644-10.743-34.335-10.743-53.095 0-18.74 3.584-36.432 10.743-53.084 7.149-16.653 16.919-31.17 29.273-43.533 12.363-12.354 26.88-22.144 43.533-29.293 16.671-7.148 34.363-10.742 53.104-10.742 18.759 0 36.45 3.594 53.094 10.742 16.644 7.149 31.17 16.939 43.523 29.293 12.373 12.363 22.115 26.88 29.302 43.533 7.149 16.652 10.733 34.344 10.733 53.084zm-24.612 0c0-15.347-2.936-29.854-8.77-43.523-5.853-13.66-13.859-25.575-24.021-35.746-10.143-10.132-22.058-18.14-35.727-23.983-13.649-5.881-28.177-8.808-43.523-8.808-15.356 0-29.855 2.926-43.543 8.808-13.66 5.843-25.556 13.851-35.708 23.983-10.152 10.171-18.159 22.086-24.021 35.746-5.853 13.669-8.789 28.177-8.789 43.523 0 15.385 2.936 29.874 8.789 43.524 5.862 13.669 13.869 25.584 24.021 35.745 10.152 10.142 22.048 18.149 35.708 24.002 13.688 5.872 28.187 8.788 43.543 8.788 15.347 0 29.874-2.916 43.523-8.788 13.669-5.853 25.584-13.86 35.727-24.002 10.161-10.161 18.168-22.076 24.021-35.745 5.834-13.65 8.77-28.139 8.77-43.524zm-32.79 0c0 10.943-2.078 21.237-6.234 30.865-4.155 9.608-9.855 17.997-17.005 25.184-7.149 7.149-15.537 12.812-25.146 16.968-9.628 4.156-19.923 6.253-30.865 6.253-10.943 0-21.219-2.097-30.846-6.253s-18.035-9.818-25.184-16.968c-7.158-7.187-12.811-15.575-16.977-25.184-4.166-9.628-6.244-19.922-6.244-30.865 0-10.924 2.078-21.18 6.244-30.846 4.166-9.627 9.818-18.016 16.977-25.165 7.149-7.178 15.557-12.83 25.184-16.996s19.903-6.263 30.846-6.263c10.942 0 21.237 2.097 30.865 6.263 9.608 4.166 17.996 9.818 25.146 16.996 7.149 7.149 12.85 15.538 17.005 25.165 4.156 9.666 6.234 19.922 6.234 30.846z"/>
</svg>`,
  dimension: { width: 312, height: 312 },
};

export const addSVGToProps = (
  input,
  getSignatur,
  url = "https://wunda-geoportal.cismet.de/poi-signaturen/",
  manualReloadRequested
) => {
  return new Promise(function (fulfilled, rejected) {
    let props = JSON.parse(JSON.stringify(input));
    let cacheHeaders = new Headers();
    if (manualReloadRequested) {
      cacheHeaders.append("pragma", "no-cache");
      cacheHeaders.append("cache-control", "no-cache");
    }
    fetch(url + getSignatur(props), { method: "get", headers: cacheHeaders })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server svg response wasn't OK");
        }
      })
      .then((svgText) => {
        const svgDocument = new DOMParser().parseFromString(svgText, "application/xml");
        const svgObject = svgDocument.documentElement;
        if (svgObject.tagName === "svg") {
          props.svgBadge = svgText;
          props.svgBadgeDimension = {
            width: svgObject.getAttribute("width"),
            height: svgObject.getAttribute("height"),
          };
          fulfilled(props);
        } else {
          throw new Error("Server svg response wasn't a SVG");
        }
      })
      .catch(function (error) {
        console.error("Problem bei /pois/signaturen/" + getSignatur(props));
        console.error(error);

        //fallback SVG
        // console.log('Will use fallbackSVG for ' + getSignatur(poi));

        props.svgBadge = DEFAULT_SVG.code;
        props.svgBadgeDimension = DEFAULT_SVG.dimension;
        fulfilled(props);
      });
  });
};
