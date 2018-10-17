var x;
var blue_range;
var sunRise = [7, 8];
var sunSet = [17, 18];
var noon = 12;
var midNight = 0;
function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(1);
  x= 0;
  blue_range=255;
}

function draw() {
  background(0,0,60);
  blue_range -= 10;
  fill(255, 255, blue_range);
  // print(blue_range);
  // moon();
  moonMovement();
  randomStar();
  river();
}
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function moon(){
  noStroke();
  ellipseMode(CORNER);
  ellipse(100,50,windowWidth/7,windowWidth/7, 60);
}
function moonMovement(){
  // translate(p5.Vector.fromAngle(second(), 10));
  moon();
}

function river(){
  var ftLvl = 600;
  fill('gray');
  vertex(400, ftLvl);
  bezierVertex(400 + 50, ftLvl, 400 + 50, ftLvl + 20, 400 - 10, ftLvl + 25);
  bezierVertex(400 - 50, ftLvl + 25, 400 - 60, ftLvl + 40, 400, ftLvl + 60);
}
function checkTime(){
  var currentHour = hour();
  if(currentHour == sunRise){

  }else if(currentHour == noon){

  }else if(currentHour == sunSet){

  }else{

  }
}

function randomStar(){
  noStroke();
  fill(255, 255, 220);
  for (var i = 0; i < 10; i++) {
    var x = random(windowWidth);
    var y = random(windowHeight-windowHeight/2);
    ellipse(x, y, 3, 3);
  }
}
