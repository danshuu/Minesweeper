import React from "react";

const Cell = ({ value, cMenu, onClick }) => {
  function getValue() {
    if (!value.isRevealed) {
      return value.isFlagged ? "🚩" : null;
    }
    if (value.isBomb) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  let className =
    "cell" +
    (value.isRevealed ? "" : " hidden") +
    (value.isBomb ? " is-bomb" : "") +
    (value.isFlagged ? " is-flag" : "");

  return (
    <div onClick={onClick} className={className} onContextMenu={cMenu}>
      {getValue()}
    </div>
  );
};

export default Cell;
