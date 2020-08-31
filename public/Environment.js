
//Environment class;

function Env(){

  this.board;
  this.done = false;

  //Initialize the environment;
  this.init = function(){
    this.board = [];
    for (let i = 0; i < BOARD_ROW * BOARD_COL; i++){
      this.board.push(0);
    }
  }

  //Receive the action;
  this.getAction = function(board, action, symbol){
    this.board = [...board];
    let new_state = this.updateBoard(action, symbol);
    let reward = this.winner();
    return [new_state, reward, this.done];
  }

  //Update the board state and return it;
  this.updateBoard = function(action, symbol){
    this.board[action.x + action.y * BOARD_ROW] = symbol;
    return this.board;
  }

 //Get the available positions/actions;
  this.getPositions = function(){
    let positions = [];
    for (let i = 0; i < BOARD_ROW; i++){
      for (let j = 0; j < BOARD_COL; j++){
        if (this.board[i + j * BOARD_ROW] == 0){
          positions.push({x: i, y: j})
        }
      }
    }
    return positions;
  }

  //Check if there is a winner;
  this.winner = function(){
    let sum ;
    //Check the rows;
    for (let i = 0; i < BOARD_ROW; i++){
      sum = 0;
      for (let j = 0; j < BOARD_COL; j++){
      sum += this.board[i + j * BOARD_ROW];
    }
    if (sum == 3){
      this.done = true;
      return 1;
    }
    if (sum == -3){
      this.done = true;
      return -1;
    }
  }

  //Check the columns
  for (let j = 0; j < BOARD_COL; j++){
    sum = 0;
    for (let i = 0; i < BOARD_ROW; i++){
    sum += this.board[i + j * BOARD_ROW];
  }
  if (sum == 3){
    this.done = true;
    return 1;
  }
  if (sum == -3){
    this.done = true;
    return -1;
  }
}

//Check diagonals
sum = 0;
for (let j = 0; j < BOARD_COL; j++){
    sum += this.board[j + j * BOARD_ROW];
}

if (sum == 3){
  this.done = true;
  return 1;
}

if (sum == -3){
  this.done = true;
  return -1;
}

sum = 0;

for (let j = 0; j < BOARD_COL; j++){
    sum += this.board[j +  (BOARD_ROW - j - 1) * BOARD_ROW];
}

if (sum == 3){
  this.done = true;
  return 1;
}

if (sum == -3){
  this.done = true;
  return -1;
}

//Tie;
let positions = this.getPositions();

if (positions.length == 0){
  this.done = true;
  return 0;
}

//Game continues otherwise;
this.done = false;
return null;
  }
}
