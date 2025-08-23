import React from "react";

const BlurCircle = ({ top, left, right, bottom }) => {
  return (
    <div
      className="absolute -z-50 aspect-square rounded-full bg-primary/30 blur-3xl"
      style={{ top, left, right, bottom, height: "14rem", width: "14rem" }}></div>
  );
};

export default BlurCircle;
