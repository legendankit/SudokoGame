import './App.css';
import {useState} from "react";

let initBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

let displayBoard = false;
let diff = 0;

function App() {
  const deepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  }

const [boardArr, setBoardArr] = useState(deepCopy(initBoard));
const [selectedOption, setSelectedOption] = useState("");

const handleSelect = (event) => {
  if(event.target.value === 'easy'){
    diff = 20;
  }else if(event.target.value === 'medium'){
    diff = 40;
  }else if(event.target.value === 'hard'){
    diff = 50;
  }else{
    diff = 60;
  }

  setSelectedOption(event.target.value);
  displayBoard = true;
  gSudoko();
};

const onInputChange = (e, row, col) => {
  let val = parseInt(e.target.value) || 0;
  let grid = deepCopy(boardArr);
  if ((val === 0) || (val >= 1 && val <= 9)) {
    grid[row][col] = val;
  }

  setBoardArr(grid);
}

const gSudoko = () => {
  let sudoku = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Display initial alert message to wait for board generation
  // setTimeout(() => {
    alert("Please wait for a 10 seconds while the board is being generated...");
  // }, 200);

  // setTimeout(() => {
    for (let i = 0; i < 9; i += 3) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          let present = new Set();
          const noRow = Math.floor(i / 3) * 3;
          const noCol = Math.floor(i / 3) * 3;

          for (let m = noRow; m < noRow + 3; m++) {
            for (let n = noCol; n < noCol + 3; n++) {
              present.add(sudoku[m][n]);
            }
          }

          // for (let m = 0; m < sudoku.length; m++) {
          //   present.add(sudoku[m][i + l]);
          // }
          // for (let n = 0; n < sudoku[0].length; n++) {
          //   present.add(sudoku[i + k][n]);
          // }

          let num;
          do {
            num = Math.floor(Math.random() * 9) + 1;
          } while (present.has(num));

          sudoku[i + k][i + l] = num;
        }
      }
    }

    solve(sudoku, initBoard, 0, 0);
    remove(initBoard, diff);
    // displaybutton = true;
    
    // Display final alert message to enjoy playing the game
    alert("Board generated! Enjoy playing the game!");
    setBoardArr(deepCopy(initBoard));
  // }, 300); // Adjust the delay time as needed
};


const remove = (sudoko, diff) => {
  
  for(let i = 0; i < diff + 6; i++){
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
      
    sudoko[row][col] = 0;
  }
}

const checkSudoko = () => {
  let sudoko = deepCopy(boardArr);
  let ansSudoko = deepCopy(initBoard);
  solve(initBoard, ansSudoko, 0 ,0);
  let compare = compareSol(sudoko, ansSudoko);
  if(compare.isComplete && compare.isSolvable){
    alert("Congratulations! You solved the sudoko. Play again");
    window.location.reload();
  }else {
    alert("Keep trying");
  }
}

const compareSol = (currSudoko, finalSudoko) => {
  let res = {
    isComplete: true,
    isSolvable: true,
  }

  for(var i = 0; i < 9; i++){
    for(var j = 0; j < 9; j++){
      if(currSudoko[i][j] === 0){
        res.isSolvable = false;
        break;
      }
      else if(currSudoko[i][j] !== finalSudoko[i][j]){
       res.isComplete = false;
       break;
     }
    }
  }
  return res;
}

const solve = (board, ans, row, col) => {
  
  if (row >= board.length) {
    for (let i = 0; i < ans.length; i++) {
      for (let j = 0; j < ans[0].length; j++) {
        ans[i][j] = board[i][j];
      }
    }
    return;
  }

  if (board[row][col] !== 0) {
    if (col + 1 >= board[0].length) {
      solve(board, ans, row + 1, 0);
    } else {
      solve(board, ans, row, col + 1);
    }
  }else {
    let present = new Set();
    const noRow = Math.floor(row / 3) * 3;
    const noCol = Math.floor(col / 3) * 3;

    for (let i = noRow; i < noRow + 3; i++) {
      for (let j = noCol; j < noCol + 3; j++) {
        present.add(board[i][j]);
      }
    }

    for (let i = 0; i < board.length; i++) {
      present.add(board[i][col]);
    }
    for (let i = 0; i < board[0].length; i++) {
      present.add(board[row][i]);
    }

    for (let i = 1; i <= 9; i++) {
      if (!present.has(i)) {
        board[row][col] = i;
        if (col + 1 >= board[0].length) {
          solve(board, ans, row + 1, 0);
        } else {
          solve(board, ans, row, col + 1);
        }
        board[row][col] = 0;
      }
    }
  }
}

// const Valid = (board, present, row, col) => {

// }

const solveSudoko = () => {
  let sudoko = deepCopy(initBoard);
  let ans = deepCopy(initBoard);

  solve(sudoko, ans, 0, 0);

  setBoardArr(ans);
  setTimeout(() => {
    alert("Sudoku solved Solution!");
    window.location.reload();
  }, 400);

}

const resetSudoko = () => {
   let sudoko = deepCopy(initBoard);
   setBoardArr(sudoko);  
}

  return (
    <div className="App">
      <div className="App-header">
        <div className="head">
        <select value={selectedOption} onChange={handleSelect}>
        <option value="">Choose Difficulty</option>
        <option value="easy">Easy Mode</option>
        <option value="medium">Medium Mode</option>
        <option value="hard">Hard Mode</option>
        <option value="devil">Devil Mode</option>
      </select>
        </div>
        <h3>Sudoko Game</h3>
        { displayBoard && (
          <>
        <div className="matrix">
          {/* Render the 9x9 matrix */}
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div className={(rowIndex + 1) % 3 === 0 ? "row" : ''} key={rowIndex}>
              {Array.from({ length: 9 }).map((_, colIndex) => (
                <input onChange={(e) => onInputChange(e, rowIndex, colIndex)}
                 value = {boardArr[rowIndex][colIndex] === 0 ? '' : boardArr[rowIndex][colIndex]} 
                 className= "cell"
                 key={colIndex}
                 disabled = {initBoard[rowIndex][colIndex] !== 0} />
              ))}
            </div>
          ))}
          </div>
          </>
        )

        }
          <div className="buttonContainer">
            {displayBoard && (
              <>
                  <button onClick={gSudoko} className="rbButton">Generate New Board</button>
                  <button onClick={checkSudoko} className="checkButton">Check Solution</button>
                  <button onClick={solveSudoko} className="solveButton">Solve</button>
                  <button onClick={resetSudoko} className="resetButton">Reset</button>
                </>
              )}
          </div>
      </div>
    </div>
  );
}

export default App;
