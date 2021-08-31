import React, { useContext } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { LightBoxContext, LightBoxDispatchContext } from "../contexts/LightBoxContextProvider";
const Comp = ({ defaultContextValues = {} }) => {
  const { title, photourls, caption, index, visible } =
    useContext(LightBoxContext) || defaultContextValues;
  const { setVisible, setIndex } = useContext(LightBoxDispatchContext) || defaultContextValues;
  if (visible) {
    let nextSrc = photourls[(index + 1) % photourls.length];
    let prevSrc = photourls[(index + photourls.length - 1) % photourls.length];

    if (photourls.length === 1) {
      nextSrc = null;
      prevSrc = null;
    }
    return (
      <Lightbox
        mainSrc={photourls[index]}
        nextSrc={nextSrc}
        prevSrc={prevSrc}
        onCloseRequest={() => setVisible(false)}
        onMovePrevRequest={() => setIndex((index + photourls.length - 1) % photourls.length)}
        onMoveNextRequest={() => setIndex((index + 1) % photourls.length)}
        imageTitle={title}
        imageCaption={caption}
        imagePadding={65}
        animationDuration={600}
      />
    );
  } else {
    return <div />;
  }
};
export default Comp;
