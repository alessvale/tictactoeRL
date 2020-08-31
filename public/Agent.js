

// Agent class;

function Agent(table){
  this.board;
  this.states;
  this.states_value = table;
  this.symbol = 1; //Useful if you want to used multiple agents competing;
  this.lr = 0.2;
  this.gamma = 0.9;
  this.epsilon = 0.3;


  //Initialize agent;

  this.init = function(){

    //Initialize the board state;
    this.board = [];
    for (let i = 0; i < BOARD_ROW * BOARD_COL; i++){
      this.board.push(0);
    }
    //Hold the collections of hashed states for update;
    this.states = [];
  }

  //Return the hash for the board state;
  this.getHash = function(board){
    return String(board);
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

  //Choose an action with a epsilon-greedy algorithm;

  this.chooseAction = function(positions){
    let val_max = -1000;
    let action;
    for (let i = 0; i < positions.length; i++){
      let p = positions[i];
      let new_board = [...this.board];
      new_board[p.x + p.y * BOARD_ROW] = this.symbol;
      let new_hash = this.getHash(new_board);
      let value;
      if (this.states_value[new_hash]){
        value = this.states_value[new_hash];
      }
      else {
        this.states_value[new_hash] = 0;
        value = 0;
      }

      if (value >= val_max){
        val_max = value;
        action = p;
      }
    }
    //From time to time, explore non-optimal actions!
    if (random(0, 1) < this.epsilon){
      let i = int(random(0, positions.length));
      return positions[i];
    }
    else
    {
    return action;
}
  }

  // Update the value functions from the states array;
  this.updateValues = function(reward){
    //Get through the state in reverse, and feedback the reward;
     for (let i = this.states.length - 1; i>=0; i--){
       let st = this.states[i];
       if (! this.states_value[st]){
         this.states_value[st] = 0;
       }
       //Use temporal difference + Q-learning;
       //Discount the reward while it gets back;
       this.states_value[st] += this.lr * (this.gamma * reward - this.states_value[st]);
       reward = this.states_value[st];
     }
  }

  //New episode;
  this.newEpisode = function(){
    this.states = [];
    for (let i = 0; i < BOARD_ROW * BOARD_COL; i++){
      this.board[i] = 0;
    }
  }

  //Record past states;
this.addState = function(state){
    this.states.push(state);
  }
}
