import React, { Component } from "react";
import Board from "./components/Board";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 8,
      width: 8,
      bombs: 10
    };
  }

  render() {
    const { height, width, bombs } = this.state;
    return (
      <div className="game">
        <Board height={height} width={width} bombs={bombs} />
      </div>
    );
  }
}

export default Game;
