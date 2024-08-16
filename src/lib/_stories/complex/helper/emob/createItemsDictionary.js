export const createItemsDictionary = (items) => {
  let steckerSet = new Set();

  for (let offer of items) {
    if (offer !== undefined && offer !== null) {
      if (offer.steckerverbindungen) {
        for (let g of offer.steckerverbindungen) {
          steckerSet.add(g.steckdosentyp);
        }
      }
    }
  }

  const steckerverbindungen = Array.from(steckerSet);

  return { steckerverbindungen };
};
