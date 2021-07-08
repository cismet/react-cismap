import React, { useContext } from "react";
import { CustomizationContext } from "../../contexts/CustomizationContextProvider";

export default ({ customizationComponent, customizationKey }) => {
  const customizations = useContext(CustomizationContext);
  try {
    let comp = customizations[customizationComponent][customizationKey];

    if (comp) {
      return comp;
    }
  } catch (e) {}
  //   return <div>emptycustomizablecomp</div>;
  return null;
};
