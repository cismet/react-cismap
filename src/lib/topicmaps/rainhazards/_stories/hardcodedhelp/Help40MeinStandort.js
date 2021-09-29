import React from "react";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";
import MyLocation from "../../../../topicmaps/docBlocks/GenericHelpTextForMyLocation";

const Component = () => {
  return (
    <GenericModalMenuSection
      sectionKey="standort"
      sectionTitle="Mein Standort"
      sectionBsStyle="success"
      sectionContent={<MyLocation />}
    />
  );
};
export default Component;
