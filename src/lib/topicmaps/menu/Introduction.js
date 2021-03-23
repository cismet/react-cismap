import React from "react";
import Markdown from "react-markdown";

const Introduction = ({ markdown }) => {
  return <Markdown escapeHtml={false} source={markdown} />;
};
export default Introduction;
