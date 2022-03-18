import localforage from "localforage";

export const setFromLocalforage = async (lfKey, setter, fallbackValue) => {
  const value = await localforage.getItem(lfKey);
  if (value !== undefined) {
    setter(value);
  } else {
    setter(fallbackValue);
  }
};
