import React from "react";

const ThemeItem = ({ color, changeColor }) => {
  return (
    <div
      className="theme__item-color"
      style={{ backgroundColor: color }}
      onClick={() => {
        changeColor(color);
      }}
    />
  );
};

export default ThemeItem;
