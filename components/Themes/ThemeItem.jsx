import React from "react";

const ThemeItem = ({ color, changeColor }) => {
  return (
    <div
      className="theme__item-color"
      style={{ backgroundColor: color }}
      onClick={(e) => {
        changeColor(color, e.currentTarget);
      }}
    />
  );
};

export default ThemeItem;
