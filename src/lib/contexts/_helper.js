import localforage from "localforage";

export const setFromLocalforage = async (lfKey, setter) => {
  const value = await localforage.getItem(lfKey);
  if (value) {
    setter(value);
  }
};
