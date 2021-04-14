const LIBERSION = "%LIBRARY_VERSION%";
const LIBHASH = "#%LIBRARY_HASH%";

export const getLibraryVersion = () => {
  /*eslint-disable no-useless-concat*/
  if (LIBERSION === "%LIBRARY" + "_" + "VERSION%") {
    return "dev-hot-reload";
  } else {
    return LIBERSION;
  }
};
export const getLibraryHash = () => {
  if (LIBHASH === "%LIBRARYP" + "_" + "HASH%") {
    return "#dev-hot-reload";
  } else {
    return LIBHASH;
  }
};
