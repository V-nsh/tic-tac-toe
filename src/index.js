import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// class Square extends React.Component {
//     // since we are using the function prop from board, we don't need the constructor
//     // constructor(props) {
//     //     // we use constructors to initialize the state
//     //     // we use super(props) in the constructor to use the class' props
//     //     super(props);
//     //     this.state = {
//     //         value: null,
//     //     };
//     // }
//     render() {
//       return (
//         <button 
//             className="square" 
//             // onClick={()=> this.setState({value:'X'})}
//             onClick={()=> this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }

// Now since we don't need the state in the square component, we can convert it to a function component
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    // we are again lifting the state up, first we lifted from square to board, not from board to the Game component.
    // we are doing this to store history of all games.
    // the square clicked will now be a prop instead of the state. so instead of using handleClick we will change the props onClick.

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     }
    // }
    // handleClick(i) {
    //   // we are copying the data and setting it back to the state because we don't want to mutate the state directly
    //   // immutable components are called pure components
    //     const squares = this.state.squares.slice();
    //     // return if the square is filled or the game is won.
    //     if (calculateWinner(squares) || squares[i]) {
    //       return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //       squares: squares, 
    //       xIsNext: !this.state.xIsNext,
    //     });
    // }
    renderSquare(i) {
        // here i is the props of Square
      return (
      <Square 
        value={this.props.squares[i]} 
        onClick={()=> this.props.onClick(i)}
      />
      );
    }
  
    render() {
      // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      // refactoring the render function because the status is now handles by the Game component.
      // const winner = calculateWinner(this.state.squares);
      // let status;
      // if (winner) {
      //   status = 'Winner' + winner;
      // } else {
      //   status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
      // }
  
      return (
        <div>
          {/* <div className="status">{status}</div> */}
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        // a stepnumber is added to the state to keep track of the current step.
        stepNumber: 0,
      }
    }
    // now that we have lifted the state, we handle click from the game class.
    // we change the function to store history of the game as well.
    handleClick(i) {
      // earlier we were just rendering the current state, that is the entire history of the game but at once.
      // now that we want to go back to some move, we will slice the history of the game to the current step and set the state accordingly.
      // NOTE: we are not changing the history array, we are just creating a new array with the current step. Step and xIsNext are the only things that change.
      const history = this.state.history.slice(0, this.state.stepNumber+1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      // we are copying the data and setting it back to the state because we don't want to mutate the state directly
      // immutable components are called pure components
        // const squares = this.state.squares.slice();
        // return if the square is filled or the game is won.
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      // const current = history[history.length-1]
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // step is the current element in the array and move is the index of the current element.
      const moves = history.map((step, move) => {
        // console.log('move: '+move+' step:' + step);
        const desc = move ? 
          'Go to move #' + move:
          'Go to game start';
          // refer: https://reactjs.org/tutorial/tutorial.html#picking-a-key to learn about keys.
          // keys are used by react to identify which items have changed, are added or removed in list items.
          // since the moves are not changed, we can use the index as the key.
          return (
            <li key={move}>
            <button onClick={() => this.jumpTo(move)} >{desc}</button>
            </li>
          );
      });

      let status;
      if (winner) {
        status = 'Winner' + winner;
      } else {
        status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i)=> this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  // helper function to find winner
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a]===squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  