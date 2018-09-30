class Player {
    constructor(x, y, targetX, targetY, img){
        this.x = x;
        this.y = y;
        this.goal = false;
        this.targetX = targetX;
        this.targetY = targetY;
        this.img = img;
    }
}
Player.prototype.move = function(x, y, walls){
    // walls = [t, r, b, l]
    if(x > 0 && !walls[1]){
        this.x += x;
    }
    if(x < 0 && !walls[3]){
        this.x += x;
    }
    if(y > 0 && !walls[2]){
        this.y += y;
    }
    if(y < 0 && !walls[0]){
        this.y += y;
    }
}
Player.prototype.reachTarget = function(){
    this.goal = (this.x === this.targetX) && (this.y === this.targetY);
    return this.goal;
}
Player.prototype.show = function(){
    let x = this.x*wallSize;
    let y = this.y*wallSize;
    image(this.img, x, y);
}

class Heart{
    constructor(xpixel, ypixel, img){
        this.x = xpixel;
        this.y = ypixel;
        this.kx = -1;
        this.ky = -1;
        this.img = img;
    }
}
Heart.prototype.show = function(){
    this.x += this.kx*10;
    this.y += this.ky*5;
    if(this.x < 0 || (this.x+50) > hSize){
        this.x = this.x < 0 ? 0 : hSize-50;
        this.kx *= -1;
    }
    if((this.y+50) > vSize || this.y < 0){
        this.y = this.y < 0 ? 0 : vSize-50;
        this.ky *= -1;
    }
    image(this.img, this.x, this.y);

}