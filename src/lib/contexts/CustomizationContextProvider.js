import React from "react";
const StateContext = React.createContext();
const CustomizationContextProvider = ({ customizations, children }) => {
  return <StateContext.Provider value={customizations}>{children}</StateContext.Provider>;
};
export default CustomizationContextProvider;
export { CustomizationContextProvider, StateContext as CustomizationContext };
