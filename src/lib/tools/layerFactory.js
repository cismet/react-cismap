import React from "react";
import Layers from "../constants/layers";

export default function getLayers(
  layerString,
  namedMapStyle = "",
  config = {
    layerSeparator: "|"
  }
) {
  const layerArr = layerString.split(config.layerSeparator || "|");
  let namedMapStyleExtension = namedMapStyle;
  if (namedMapStyleExtension===null||namedMapStyleExtension==='default'){
    namedMapStyleExtension="";
  }
  if (namedMapStyleExtension!=="" ){
    namedMapStyleExtension="."+namedMapStyleExtension;
  }  
  console.log('namedMapStyleExtension',namedMapStyleExtension);
  
  return (
    <div>
      {layerArr.map(layerWithOptions => {
        const layOp = layerWithOptions.split("@");
        if (!isNaN(parseInt(layOp[1], 10))) {
          const key=layOp[0] + namedMapStyleExtension;
          const layerGetter = Layers.get(key);

          if (layerGetter) {
            return layerGetter({
              opacity: parseInt(layOp[1] || "100", 10) / 100.0
            });
          } else {
            return null;
          }
        }
        if (layOp.length === 2) {
          try {
            let options = JSON.parse(layOp[1]);
            const layerGetter = Layers.get(layOp[0] + namedMapStyleExtension);
            if (layerGetter) {
              return layerGetter(options);
            } else {
              return null;
            }
          } catch (error) {
            console.error(error);
            console.error(
              "Problems during parsing of the layer options. Skip options. You will get the 100% Layer:" +
                layOp[0]
            );
            const layerGetter = Layers.get(layOp[0] + namedMapStyleExtension);
            if (layerGetter) {
              return layerGetter();
            } else {
              return null;
            }
          }
        } else {
          const layerGetter = Layers.get(layOp[0] + namedMapStyleExtension);
          if (layerGetter) {
            return layerGetter();
          } else {
            return null;
          }
        }
      })}
    </div>
  );
}
