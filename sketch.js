var cellSize = 10;
var xRange = 120;
var yRange = 80;
var cells = [];
var start = 0;
var count = 0;

function setup() {
  createCanvas(1200,800)
  makeCells();
  drawBoard();
  frameRate(4);
}

function draw() {
  if(start==1) {
    updateStates();
  }
  drawCells()
}

function keyPressed() {
  console.log("Updating...")
  start = 1;
}

function updateStates() {
  for(var j=0; j<xRange; j++) {
    for(var k=0; k<yRange; k++) {
      cells[j][k].evolve();
    }
  }
  drawCells();
}

function drawCells() {
  
  var greenColor = 0;
  for(var j=0; j<xRange; j++) {
    for(var k=0; k<yRange; k++) {
      fill(250)
      if(cells[j][k].state != cells[j][k].nextState) {
        if(cells[j][k].nextState==1) {
          fill(50, 180, 220);
        }
        cells[j][k].state = cells[j][k].nextState;
        rect(j*cellSize, k*cellSize, cellSize, cellSize);
        //console.log(greenColor)
      }
    }
  }
}

function drawBoard() {
  for(var j=0; j<xRange; j++) {
    for(var k=0; k<yRange; k++) {
      fill(250)
      if(cells[j][k].nextState==1) {
        fill(50, 180, 220);
      }
      cells[j][k].state = cells[j][k].nextState;
      rect(j*cellSize, k*cellSize, cellSize, cellSize);
      //console.log(greenColor)
    }
  }
}

function mouseClicked() {
  var xIndex = Math.floor(mouseX/cellSize);
  var yIndex = Math.floor(mouseY/cellSize);
  //console.log("Clicked: "+xIndex+", "+yIndex)
  cells[xIndex][yIndex].stateSwitch();
}

function bound(bound_num, num) {
  if (num>(bound_num-1)) {
    return num%(bound_num-1)
  } else if(num<0) {
    return bound_num+num
  } else {
    return num;
  }
}

function cell(state, pointx, pointy) {
  this.state = state;
  this.pointX = pointx;
  this.pointY = pointy;
  this.livingNeighbors = 0;
  this.nextState = 0;
  
  this.setAlive = function() {
    this.state = 1;
  }
  
  this.setDead = function() {
    this.state = 0;
  }
  
  this.stateSwitch = function() {
    if(this.state==0) {
      this.nextState = 1;
    } else {
      this.nextState = 0;
    }
  }
  
  this.getLivingNeighbors = function() {
    this.livingNeighbors = 0;
    this.livingNeighbors += cells[bound(xRange, (this.pointX - 1))][bound(yRange, (this.pointY - 1))].state;
    this.livingNeighbors += cells[this.pointX][bound(yRange, (this.pointY - 1))].state;
    this.livingNeighbors += cells[bound(xRange, (this.pointX + 1))][bound(yRange, (this.pointY - 1))].state;
    this.livingNeighbors += cells[bound(xRange, (this.pointX - 1))][this.pointY].state;
    this.livingNeighbors += cells[bound(xRange, (this.pointX + 1))][this.pointY].state;
    this.livingNeighbors += cells[bound(xRange, (this.pointX - 1))][bound(yRange, (this.pointY + 1))].state;
    this.livingNeighbors += cells[this.pointX][bound(yRange, (this.pointY + 1))].state;
    this.livingNeighbors += cells[bound(xRange, (this.pointX + 1))][bound(yRange, (this.pointY + 1))].state;
    return this.livingNeighbors;
  }
  


  this.evolve = function() {
    this.getLivingNeighbors();
    if (this.state==1 && (this.livingNeighbors<2 || this.livingNeighbors>3)) {
      this.nextState = 0;
    } else if(this.state == 1 && (this.livingNeighbors == 2 || this.livingNeighbors == 3)) {
      this.nextState = 1;
    } else if(this.state === 0 && this.livingNeighbors == 3) {
      this.nextState = 1;
    }
  }
}

function makeCells() {
  for(var i=0; i<xRange; i++) {
    cellColumn = []
    for(var h=0; h<yRange; h++) {
      cellColumn.push(new cell(0,i,h));
    }
    cells.push(cellColumn);
  }
}

