import { md5FetchText, fetchJSON } from "../../tools/fetching";
import { getGazDataForTopicIds } from "../../tools/gazetteerHelper";

export const storiesCategory = "MoreComplexStuff/";
export const host = "https://wupp-topicmaps-data.cismet.de";

export const getGazData = async (
  setGazData,
  topics = ["bpklimastandorte", "pois", "kitas", "bezirke", "quartiere", "adressen"]
) => {
  const prefix = "GazDataForStories";
  const sources = {};

  sources.adressen = await md5FetchText(prefix, host + "/data/adressen.json");
  sources.bezirke = await md5FetchText(prefix, host + "/data/bezirke.json");
  sources.quartiere = await md5FetchText(prefix, host + "/data/quartiere.json");
  sources.pois = await md5FetchText(prefix, host + "/data/pois.json");
  sources.kitas = await md5FetchText(prefix, host + "/data/kitas.json");
  sources.bpklimastandorte = await md5FetchText(prefix, host + "/data/bpklimastandorte.json");

  const gazData = getGazDataForTopicIds(sources, topics);

  setGazData(gazData);
};
