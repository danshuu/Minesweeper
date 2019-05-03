import React, { Component } from "react";
import Cell from "./Cell";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: this.buildBoard(
        this.props.height,
        this.props.width,
        this.props.bombs
      ),
      gameWon: false,
      bombCount: this.props.bombs
    };
  }

  buildBoard(height, width, bombs) {
    let board = [];

    for (let i = 0; i < height; i++) {
      board.push([]);
      for (let j = 0; j < width; j++) {
        board[i][j] = {
          x: i,
          y: j,
          isBomb: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false
        };
      }
    }
    board = this.plantbombs(board, height, width, bombs);
    board = this.getNeighbours(board, height, width);
    return board;
  }

  getRandomNumber(num) {
    return Math.floor(Math.random() * 999 + 1) % num;
  }

  plantbombs(data, height, width, bombs) {
    let randomx,
      randomy,
      bombsPlanted = 0;

    while (bombsPlanted < bombs) {
      randomx = this.getRandomNumber(width);
      randomy = this.getRandomNumber(height);
      if (!data[randomx][randomy].isBomb) {
        data[randomx][randomy].isBomb = true;
        bombsPlanted++;
      }
    }

    return data;
  }

  getNeighbours(board, height, width) {
    let updatedData = board;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (board[i][j].isBomb !== true) {
          let bombs = 0;
          const area = this.traverseBoard(board[i][j].x, board[i][j].y, board);
          area.forEach(value => {
            if (value.isBomb) {
              bombs++;
            }
          });
          if (bombs === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = bombs;
        }
      }
    }

    return updatedData;
  }

  traverseBoard(x, y, data) {
    const el = [];

    if (x) {
      el.push(data[x - 1][y]);
    }

    if (x < this.props.height - 1) {
      el.push(data[x + 1][y]);
    }

    if (y) {
      el.push(data[x][y - 1]);
    }

    if (y < this.props.width - 1) {
      el.push(data[x][y + 1]);
    }

    if (x && y) {
      el.push(data[x - 1][y - 1]);
    }

    if (x && y < this.props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    if (x < this.props.height - 1 && y) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }

  revealBoard() {
    let board = this.state.boardData;
    board.forEach(row => {
      row.forEach(cell => {
        cell.isRevealed = true;
      });
    });
    this.setState({
      boardData: board
    });
  }

  revealEmpty(x, y, board) {
    let area = this.traverseBoard(x, y, board);
    area.forEach(value => {
      if (!value.isRevealed && (value.isEmpty || !value.isBomb)) {
        board[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.revealEmpty(value.x, value.y, board);
        }
      }
    });
    return board;
  }

  getbombs(board) {
    let bombArray = [];

    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isBomb) {
          bombArray.push(cell);
        }
      });
    });

    return bombArray;
  }

  getFlags(board) {
    let bombArray = [];

    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isFlagged) {
          bombArray.push(cell);
        }
      });
    });

    return bombArray;
  }

  getHidden(board) {
    let bombArray = [];

    board.forEach(row => {
      row.forEach(cell => {
        if (!cell.isRevealed) {
          bombArray.push(cell);
        }
      });
    });

    return bombArray;
  }

  handleCellClick(x, y) {
    let win = false;

    if (this.state.boardData[x][y].isRevealed) return null;

    if (this.state.boardData[x][y].isBomb) {
      this.revealBoard();
      alert("game over");
    }

    let board = this.state.boardData;
    board[x][y].isFlagged = false;
    board[x][y].isRevealed = true;

    if (board[x][y].isEmpty) {
      board = this.revealEmpty(x, y, board);
    }

    if (this.getHidden(board).length === this.props.bombs) {
      win = true;
      this.revealBoard();
      alert("You Win");
    }

    this.setState({
      boardData: board,
      bombCount: this.props.bombs - this.getFlags(board).length,
      gameWon: win
    });
  }

  _handleContextMenu(event, x, y) {
    event.preventDefault();
    let board = this.state.boardData;
    let bombs = this.state.bombCount;
    let win = false;
    if (board[x][y].isRevealed) return; // don't do anything if it's already clicked on

    if (board[x][y].isFlagged) {
      board[x][y].isFlagged = false;
      bombs++;
    } else {
      if (bombs) {
        board[x][y].isFlagged = true;
        bombs--;
      }
    }

    if (bombs === 0) {
      const bombArray = this.getbombs(board);
      const FlagArray = this.getFlags(board);
      win = JSON.stringify(bombArray) === JSON.stringify(FlagArray);
      if (win) {
        this.revealBoard();
        alert("You Win");
      }
    }

    this.setState({
      boardData: board,
      bombCount: bombs,
      gameWon: win
    });
  }

  renderBoard(board) {
    return board.map(row => {
      return row.map(cell => {
        return (
          <div key={cell.x * row.length + cell.y}>
            <Cell
              onClick={() => this.handleCellClick(cell.x, cell.y)}
              cMenu={e => this._handleContextMenu(e, cell.x, cell.y)}
              value={cell}
            />
            {row[row.length - 1] === cell ? <div className="clear" /> : ""}
          </div>
        );
      });
    });
  }

  render() {
    return (
      <div className="board">
        <div className="game-info">
          <span className="info">bombs: {this.state.bombCount}</span>
          <br />
          <span className="info">{this.state.gameWon ? "You Win" : ""}</span>
        </div>
        {this.renderBoard(this.state.boardData)}
      </div>
    );
  }
}
