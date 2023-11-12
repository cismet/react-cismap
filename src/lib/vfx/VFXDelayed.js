import React, { useEffect, useState } from "react";

export default function (props) {
  const { delay } = props;
  cont[(shown, setShown)] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShown(true);
    }, delay);
  }, []);

  if (shown) {
    return props.children;
  }
}
