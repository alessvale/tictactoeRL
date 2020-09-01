
let scl = 0.7;

function Block(x, y, w){
  this.x = x;
  this.y = y;
  this.w = w;
  this.symbol = 0;


  this.display = function(){
    if ( this.symbol == 1){
      strokeWeight(5);
      stroke(100, 149, 237);
      ellipse(this.x, this.y, this.w * scl, this.w * scl)
    }
    if (this.symbol == -1){
      push();
      strokeWeight(5);
      stroke(255, 166, 76);
      translate(this.x, this.y);
      rotate(PI * 0.25);
      line(-this.w * scl * 0.8, 0, this.w * scl * 0.8, 0);
      line(0, -this.w * scl * 0.8, 0, this.w * scl * 0.8);
      pop();
    }
  }

  this.check = function(mouse_x, mouse_y){
    if (mouse_x <= this.x + w * 0.5 && mouse_x > this.x - w * 0.5 && mouse_y <= this.y + w * 0.5 && mouse_y > this.y - w * 0.5){
      return true;
    }
    else{
      return false;
    }
  }

  this.isAvailable = function(){
    if (this.symbol == 0){
      return true;
    }
    else {
      return false;
    }
  }

}
