class Cell {
    constructor(x, y, idx){
        this.x = x;
        this.y = y;
        this.visited = false;
        this.wall = [true, true, true, true];
        this.idx = idx;
    }
}
Cell.prototype.checkNeighbours = function(grid){
    let top = grid[index(this.x, this.y -1)];
    let right = grid[index(this.x+1, this.y)];
    let left = grid[index(this.x-1, this.y)];
    let bottom = grid[index(this.x, this.y+1)];
    if (top && !top.visited){
        return true;
    }
    if (right && !right.visited){
        return true;
    }
    if (left && !left.visited){
        return true;
    }
    if (bottom && !bottom.visited){
        return true;
    }
    return false;
}
Cell.prototype.addNeighbours = function(neighbours, grid){
    let top = grid[index(this.x, this.y -1)];
    let right = grid[index(this.x+1, this.y)];
    let left = grid[index(this.x-1, this.y)];
    let bottom = grid[index(this.x, this.y+1)];
    if (top && !top.visited && !neighbours.some(n => n.idx === top.idx)){
        neighbours.push(top);
    }
    if (right && !right.visited && !neighbours.some(n => n.idx === right.idx)){
        neighbours.push(right);
    }
    if (left && !left.visited && !neighbours.some(n => n.idx === left.idx)){
        neighbours.push(left);
    }
    if (bottom && !bottom.visited && !neighbours.some(n => n.idx === bottom.idx)){
        neighbours.push(bottom);
    }
}
Cell.prototype.removeWall = function(maze){
    let wallRemoved = false;
    let listIndex = [0, 1, 2, 3];
    while(!wallRemoved){
        // use this trick in order to avoid infinite loop due to 
        // randomly choose non valid maze cells
        let indxRemove = Math.floor(listIndex.length*Math.random());
        let wallToRemove = listIndex.splice(indxRemove, 1);
        switch(wallToRemove[0]){
            case 0 : //top
                if(this.wall[0]){
                    let cell = maze.find(c => c.idx === index(this.x, this.y -1));
                    if(cell){
                        cell.wall[2] = false;
                        this.wall[0] = false;
                        this.visited = true;
                        wallRemoved = true;
                    }
                }
                break;
            case 1 : //right
                if(this.wall[1]){
                    let cell = maze.find(c => c.idx === index(this.x+1, this.y));
                    if(cell){
                        cell.wall[3] = false;
                        this.wall[1] = false;
                        this.visited = true;
                        wallRemoved = true;
                    }
                }
                break;
            case 2 : //bottom
                if(this.wall[2]){
                    let cell = maze.find(c => c.idx === index(this.x, this.y +1));
                    if(cell){
                        cell.wall[0] = false;
                        this.wall[2] = false;
                        this.visited = true;
                        wallRemoved = true;
                    }
                }
                break;
            case 3 : //left
                if(this.wall[3]){
                    let cell = maze.find(c => c.idx === index(this.x -1, this.y));
                    if(cell){
                        cell.wall[1] = false;
                        this.wall[3] = false;
                        this.visited = true;
                        wallRemoved = true;
                    }
                }
                break;
            default:
                wallRemoved = true;
                break;
        }
    }
}
Cell.prototype.show = function(dbuffer) {
    let x = this.x*wallSize;
    let y = this.y*wallSize;
    if (this.wall[0]){
        dbuffer.line(x, y, x + wallSize, y);
    }
    if (this.wall[1]){
        dbuffer.line(x + wallSize, y, x + wallSize,y + wallSize);
    }
    if (this.wall[2]){
        dbuffer.line(x + wallSize, y + wallSize, x, y + wallSize);
    }
    if (this.wall[3]){
        dbuffer.line(x, y + wallSize, x, y);
    }
}
function index(x, y){
    if (x < 0 || y < 0 || x >(ncols - 1) || y > (nrows - 1)){
        return -1;
    }
    return x+y*ncols;
}