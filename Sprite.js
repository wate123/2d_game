function Tile(){
  this.add = function(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    // this.num = num;
    this.tile = createSprite(this.x,this.y, this.size, this.size);
    this.tile.addImage(ground);
  
    // this.tile.width = this.size;
    // this.tile.height = this.size;
    // this.tile.immovable = true;

    return this.tile
    // for (var i = 0; i < num; i++) {
    //   this.tile[i] = createSprite(this.x,this.y, this.size, this.size);
    // }
  }
}

function Block(x,y,numCol, numRow, group){
  var startX = x;
  var startY = y;
  var blockGroup = new Group();
  for (var i = 1; i <= numCol; i++) {
    startX = x;
    startY = startY + 20;
    for (var j = 1; j <= numRow; j++) {
      group.add(new Tile().add(startX+=20,startY,20));
    }
  }
  // return blockGroup;
}