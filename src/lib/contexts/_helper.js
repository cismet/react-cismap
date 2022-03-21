import localforage from "localforage";

export const setFromLocalforage = async (lfKey, setter, fallbackValue, forceFallback) => {
  const value = await localforage.getItem(lfKey);
  if (value !== undefined && value !== null) {
    setter(value);
  } else if (fallbackValue !== undefined || forceFallback === true) {
    setter(fallbackValue);
  }
};
