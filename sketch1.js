var charater_walk, charater_idle, thunder;
var character_sheet, charater_animation, character_sprite;
var ground;
var tile, tiles;
var keyMap;
var canvasWidth, canvasHeight;
var GRAVITY = 1, jumpPower = 5;
var flowGroup;
var collideGroup, thunderGroup;
var gameOver = false;



function preload(){
  charater_walk = loadAnimation("/charater/walk1.png","/charater/walk23.png");
  charater_idle = loadAnimation("/charater/idle1.png","/charater/idle14.png");
  charater_jump = loadAnimation("/charater/jump1.png","/charater/jump29.png");
  
  thunder = loadAnimation("/Thunder/thunder1.png", "/Thunder/thunder12.png");
}

function setup(){
  canvasHeight = 600;
  canvasWidth = 700;
  createCanvas(canvasWidth,canvasHeight);
  // frameRate(30);
  keyMap = [LEFT_ARROW,'a',RIGHT_ARROW, "d", UP_ARROW, "w"];
  character_sprite = createSprite(canvasWidth/2, canvasHeight/2);
  character_sprite.addAnimation('idle', charater_idle);
  character_sprite.addAnimation('walk', charater_walk);
  character_sprite.addAnimation('jump', charater_jump);

  collideGroup = new Group();
  thunderGroup = new Group;
  var tile_x = 0;
  var tile_y = 0;
  for (var i = 0; i < 40; i++) {
    topTile = new Tile().add(tile_x+=20,0, 20);
    leftTile = new Tile().add(0,tile_y+=10, 20);
    rightTile = new Tile().add(canvasWidth,tile_y+=10, 20);
    collideGroup.add(topTile);
    collideGroup.add(leftTile);
    collideGroup.add(rightTile);
  }  
  for (var i = 1; i < 4; i++) {
    tile_x = 0;
    for (var j = 0; j < 40; j++) {
      collideGroup.add(new Tile().add(tile_x+=20, canvasHeight*0.95+i*10, 20));
    }
  }
  Block(canvasWidth/4, canvasHeight*0.7, 1, 6, collideGroup);

  
}

function draw(){
  if(character_sprite.position.y > canvasHeight+40 || character_sprite.position.x > canvasWidth+40){
    die();
  }
  if(gameOver && keyWentDown('space'))
    newGame();

  if(gameOver != true){
    background(0);
    // if(character_sprite.position.y > canvasHeight-50){
    //   console.log(character_sprite.position.y);
    //   character_sprite.position.y = canvasHeight-50;
    // }
    character_sprite.changeAnimation('idle');
    character_sprite.mass = 20;
    //gravity for the player
    character_sprite.velocity.y += GRAVITY;
    // if(character_sprite.velocity.y > 20){
    //   character_sprite.velocity.y = 0;
    // }
    // if (character_sprite.position.y == canvasHeight){
    //   character_sprite.velocity = 0;
    // }
    if(character_sprite.collide(collideGroup)){
      character_sprite.velocity.y = 0;
    };
    // if(character_sprite.position.x > 670 || character_sprite.position.y > 550){
    //   character_sprite.position = createVector();
    // }
    if (frameCount % 30 == 0 ){
      var thunder_collide = spawnThunder(random(canvasWidth), random(canvasHeight));
      thunderGroup.add(thunder_collide);
      setInterval(function (){
        thunderGroup.remove(thunder_collide);
        removeSprite(thunder_collide);
      }, 1200);
    }

    character_sprite.overlap(thunderGroup, function(){
      setTimeout(function(){
        die();
      },100)
      
    })
    playerControl();
    drawSprites();
  }
  console.log(character_sprite.position);
}

function die(){
  character_sprite.velocity.y = 0;
  fill(255,255,255);
  textAlign(CENTER);
  textSize(64);
  text("Game Over", canvasWidth/2, canvasHeight/2);
  textSize(16);
  text("Press Space to Continue", canvasWidth/2, canvasHeight*0.7);
  updateSprites(false);
  gameOver = true;
  
}

function newGame(){
  thunderGroup.removeSprites();
  gameOver = false;
  updateSprites(true);
  character_sprite.position = createVector(Math.round(random(50,canvasWidth-50)), Math.round(random(50, canvasHeight-50)));
  if(character_sprite.collide(collideGroup)){
    character_sprite.velocity.y = 0;
  };
}

function spawnThunder(x, y){
  var thunder_sprite = createSprite(x, y);
  thunder_sprite.addAnimation('thunder', thunder);
  thunder_sprite.overlap(collideGroup, function(){
    removeSprite(thunder_sprite);
  })
  thunder_sprite.setDefaultCollider();
  return thunder_sprite;
}

function playerControl(){
  if(keyDown(keyMap[0]) || keyDown(keyMap[1])){
    character_sprite.changeAnimation('walk');
    character_sprite.mirrorX(1);
    character_sprite.position.x -= 3;
  }
  if (keyWentDown('c')|| keyWentDown(keyMap[4]) || keyWentDown(keyMap[5])){
    character_sprite.changeAnimation('jump');
    character_sprite.velocity.y = -jumpPower*3;
  }
  
  if (keyDown(keyMap[2]) || (keyDown(keyMap[3]))){
    character_sprite.mirrorX(-1);
    character_sprite.changeAnimation('walk');
    character_sprite.position.x += 3;
  }
}