var charater_walk, charater_idle, charater_jump, thunder, ground;
var character_sheet, charater_animation, character_sprite, spike_sprite, star_sprite, star_sprite2, star_sprite3;
var ground, spike, star;
var tile, tiles;
var keyMap;
var canvasWidth, canvasHeight;
var GRAVITY = 1, jumpPower = 5;
var collideGroup, damageGroup, fallGroup, starGroup, breakGroup;
var gameOver = false;
var random_x_points = [];

function preload(){
  charater_walk = loadAnimation("/character/walk1.png","/character/walk23.png");
  charater_idle = loadAnimation("/character/idle1.png","/character/idle14.png");
  charater_jump = loadAnimation("/character/jump1.png","/character/jump29.png");
  ground = loadImage('Ground/ground0_20x20.png');
  spike = loadImage('spike_20x20.png');
  star = loadImage('star.png');
  thunder = loadAnimation("/Thunder/thunder1.png", "/Thunder/thunder12.png");
}

function setup(){
  canvasHeight = 600;
  canvasWidth = 700;
  createCanvas(canvasWidth,canvasHeight);
  // frameRate(30);
  keyMap = [LEFT_ARROW,'a',RIGHT_ARROW, "d", UP_ARROW, "w"];
  character_sprite = createSprite(canvasWidth*0.95, canvasHeight/2);
  spike_sprite = createSprite(canvasWidth*0.26, canvasHeight*0.91);
  star_sprite = createSprite(canvasWidth*0.38, canvasHeight*0.91);
  star_sprite2 = createSprite(40, canvasHeight*0.9);
  environment();
  
  for (var i = 0; i < breakGroup.length; i++) {
    breakGroup[i].touching.top = false;
  }

  for (var i = 0; i < Math.round(random(5, 15)); i++) {
    random_x_points.push(Math.round(random(20, canvasWidth-80)));
  }

  for (var i = 0; i < collideGroup.length; i++) {
    for (var j = 0; j < random_x_points.length; j++) {
      if(collideGroup[i].position.x < random_x_points[j]+10 && collideGroup[i].position.x > random_x_points[j]-10 ){
        // collideGroup[i].debug = true;
        fallGroup.add(collideGroup[i]);
      }
    }
  }
  // for (var i = 0; i < collideGroup.length; i++) {
  //   collideGroup[i].debug = true;
  // }
  // console.log(Math.round(random(collideGroup.length)))
}

function draw(){
  if(character_sprite.position.y > canvasHeight+40 || character_sprite.position.x > canvasWidth+40){
    die();
  }

  if(gameOver && keyWentDown('space')){
    newGame();
  }

  if(gameOver != true){
    background(0);
    character_sprite.changeAnimation('idle');
    character_sprite.velocity.y += GRAVITY;
    
    //collide non moving structure.
    character_sprite.collide(collideGroup, function () {
      character_sprite.velocity.y = 0;
    })
    //collide falling structure.
    // character_sprite.displace(fallGroup, function () {
    //   character_sprite.velocity.y = 10;
    // })

    //colide reward and trigger spike
    character_sprite.overlap(starGroup, function(){
      star_sprite.remove();
      spike_sprite.velocity.x = 2;
    })

    //colide with damage group
    character_sprite.overlap(damageGroup, function(){
      setTimeout(function(){
        die();
      },100)
      
    })
    character_sprite.overlap(fallGroup, function(current, collide){
      character_sprite.velocity.y = 15;
      collide.remove();
    })
    // if(character_sprite.collide(collideGroup)){
    //   console.log('x')
    //   character_sprite.velocity.y = 0;
    // };
    //gravity for the player
    character_sprite.maxSpeed = 50;
    // if(character_sprite.position.x > 670 || character_sprite.position.y > 550){
    //   character_sprite.position = createVector();
    // }
    if (frameCount % 30 == 0 ){
      var thunder_collide = spawnThunder(random(canvasWidth), random(canvasHeight));
      damageGroup.add(thunder_collide);
      setInterval(function (){
        damageGroup.remove(thunder_collide);
        removeSprite(thunder_collide);
      }, 1200);
    }

    
    playerControl();
    drawSprites();
  }
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
  window.location.reload(false);
  // thunderGroup.removeSprites();
  // gameOver = false;
  // // character_sprite.position = createVector(canvasWidth*0.95, canvasHeight/2);
  // character_sprite.position.x = canvasWidth*0.95;
  // character_sprite.position.y = canvasHeight/2;
  // updateSprites(true);
  
}

function spawnThunder(x, y){
  var thunder_sprite = createSprite(x, y);
  thunder_sprite.addAnimation('thunder', thunder);
  thunder_sprite.overlap(collideGroup, function(){
    removeSprite(thunder_sprite);
  })
  thunder_sprite.overlap(fallGroup, function(){
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

function environment(){
  character_sprite.addAnimation('idle', charater_idle);
  character_sprite.addAnimation('walk', charater_walk);
  character_sprite.addAnimation('jump', charater_jump);

  spike_sprite.addImage('spike', spike);
  star_sprite.addImage('star', star);
  star_sprite2.addImage('star', star);

  spike_sprite.rotation = 90;

  collideGroup = new Group();
  damageGroup = new Group();
  fallGroup = new Group();
  starGroup = new Group();
  breakGroup = new Group();

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
  //buttom tiles
  for (var i = 1; i < 4; i++) {
    tile_x = 0;
    for (var j = 0; j < 40; j++) {
      // if(j > 24 || (j > 18 && j <23) || (j >2 && j<9)){
      //   fallGroup.add(new Tile().add(tile_x+=20, canvasHeight*0.95+i*10, 20));
      // }else{
        collideGroup.add(new Tile().add(tile_x+=20, canvasHeight*0.95+i*10, 20));
      // }
    }
  }
  //level blocks
  Block(canvasWidth*0.80, canvasHeight*0.7, 7, 6, collideGroup);
  Block(canvasWidth*0.743, canvasHeight*0.768, 5, 2, collideGroup);
  Block(canvasWidth*0.657, canvasHeight*0.835, 3, 3, collideGroup);
  Block(canvasWidth*0.42, canvasHeight*0.75, 3, 3, collideGroup);
  Block(canvasWidth*0.332, canvasHeight*0.75, 2, 3, breakGroup);
  Block(canvasWidth*0.215, canvasHeight*0.75, 3, 4, collideGroup);
  Block(canvasWidth*0.158, canvasHeight*0.815, 4, 2, collideGroup);
  Block(canvasWidth*0.1, canvasHeight*0.88, 2, 2, collideGroup);

  Block(0, canvasHeight*0.2, 5, 10, collideGroup);
  Block(canvasWidth*0.285, canvasHeight*0.3, 4, 8, collideGroup);
  Block(canvasWidth*0.43, canvasHeight*0.38, 4, 8, collideGroup);

  Block(canvasWidth*0.75, 0, 4, 8, collideGroup);
  Block(canvasWidth*0.83, canvasHeight*0.1, 4, 5, collideGroup);
  Block(canvasWidth*0.9, canvasHeight*0.2, 4, 3, collideGroup);


  //reward
  starGroup.add(star_sprite);
  damageGroup.add(spike_sprite);
}