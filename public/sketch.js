
let BOARD_ROW = 3;
let BOARD_COL = 3;

let agent;
let env;
let blocks;
let value_table;
let w;
let time;

let new_state, winner, done;

function preload(){
  value_table = loadJSON("/values");
}

function setup(){
  let canvas = createCanvas(800, 800);
  canvas.parent("container");
  background(255);

  //Initialize the graphics;
  blocks = [];
  w = 200;

  for (let i = 0; i < BOARD_ROW * BOARD_COL; i++){
    let index_i = i % BOARD_ROW;
    let index_j = int(i/BOARD_ROW);
    let x = map(index_i, 0, 2, width * 0.5 - w, width * 0.5 + w);
    let y = map(index_j, 0, 2, height * 0.5 - w, height * 0.5 + w);
    blocks.push(new Block(x, y, w));
  }

  done = false;

  //Initialize the agent and the environment;
  agent = new Agent(value_table);
  agent.init();
  env = new Env();
  env.init();

  //Start a move;
  agentMove();
}

function draw(){
  background(255);

  //draw the grid;
  stroke(0);
  strokeWeight(8);
  line(width * 0.5 - w * 0.5, height * 0.5 - 1.5 * w, width * 0.5 - w * 0.5,  height * 0.5 + 1.5 * w );
  line(width * 0.5 + w * 0.5, height * 0.5 - 1.5 * w, width * 0.5 + w * 0.5,  height * 0.5 + 1.5 * w );
  line(width * 0.5 - w * 1.5, height * 0.5 - 0.5 * w, width * 0.5 + w * 1.5,  height * 0.5 - 0.5 * w );
  line(width * 0.5 - w * 1.5, height * 0.5 + 0.5 * w, width * 0.5 + w * 1.5,  height * 0.5 + 0.5 * w );

  //Display the squares that make the grid;
  blocks.forEach(b => b.display());

  let t = millis() - time;
  if (done && t > 3000){
    reset();
  }
}


function mouseClicked(){
  if (!done){
  for (let i = 0; i < blocks.length; i++){
    let b = blocks[i];
    //Check if the clicked box is free;
    if (b.isAvailable()){
      if(b.check(mouseX, mouseY)){
        b.symbol = -1;
        //Pass the selected action to the environment
        let act = {x: i % BOARD_ROW, y: int(i/BOARD_ROW)};
        [new_state, winner, done] = env.getAction(new_state, act, -1);

        //Update the agent state;
        agent.board = [...new_state];

        if (!done){
          agentMove();
        }
        else {
            giveReward(winner);
            time = millis();
        }
        break;
      }
    }
  }
}
}

function agentMove(){
  //Get the available positions;
  let positions = agent.getPositions();
  //Choose an action in an epsilon-greedy way;
  let action = agent.chooseAction(positions);
  //Hash the current state to be able to retrive it through the value-state table;
  let current_state = agent.getHash(agent.board);
  //Add the current state to the agent's state list, in order to distribute the reward later;
  agent.addState(current_state);
  //Fill the symbol in the selected box;
  let index = action.x + action.y * BOARD_ROW;
  blocks[index].symbol = 1;
  [new_state, winner, done] = env.getAction(agent.board, action, 1);

  if (done){
    giveReward(winner);
    time = millis();
}
}


function giveReward(winner){
  if (winner == 1){
  agent.updateValues(1);
}
if (winner == -1) {
  agent.updateValues(0);
}
else{
  //In case of a tie, we provide a very small reward;
  agent.updateValues(0.1);
}
//Sending the table to the server to be saved;
httpPost('/save', agent.states_value, 'json');
}

function reset(){
  //Start the game again;
  //Reinitialize the board;
  for (let i = 0; i < BOARD_ROW * BOARD_COL; i++){
    blocks[i].symbol = 0;
  }
  //Start a new episode;
  agent.newEpisode();
  //Create a brand new environment;
  env = new Env(agent);
  done = false;
  agentMove();
}

function keyPressed(){
  reset();
}
