let grid = [];
let neighbours = [];
let maze = [];
let vSize = 640;
let hSize = 800;
let wallSize = 40;
let ncols = Math.floor(hSize/wallSize);
let nrows = Math.floor(vSize/wallSize);
let player;
let enemy;
let heart;
let skull;
let mazeCanvas;
let playerImg;
let targetImg;
let bg;
let heartImg;
let skullImg;
let counter = 35;
let tiempo;
let targetReached = false;
let isDead = false;

function preload(){
    bg = loadImage('./fondo.jpg');
    playerImg = loadImage('./jolmos.png');
    targetImg = loadImage('./pui.png');
    heartImg = loadImage('./corazon.png');
    skullImg = loadImage('./skull.png');
}
function setup(){
    const can = createCanvas(hSize+1, vSize+1);
    mazeCanvas = createGraphics(hSize, vSize);
    can.parent(document.getElementById("canvasContainer"));
    tiempo = document.getElementById("tiempo");
    heartImg.resize(150,0);
    player = new Player(0, 0, playerImg);
    enemy =  new Player(ncols-1, nrows-1, targetImg);
    noFill();
    generateGrid();
    generateMaze();
    mazeDraw(mazeCanvas);
}
function draw(){
    image(mazeCanvas, 0, 0);
    targetReached = player.reachTarget(enemy);
    if(isDead){
        if(!skull){
            skull = new Reward(player.x*wallSize, player.y*wallSize, skullImg);
        }
        skull.show();
    }else{
        player.show();
        enemy.show();
    }
    if(targetReached){
        if(!heart){
            heart = new Reward(player.x*wallSize, player.y*wallSize, heartImg);
        }
        heart.show();
    }else{
        if(frameCount%60 === 0 && !isDead){
            counter--;
            isDead = counter === 0;
        }
        if(frameCount%5 === 0 && !isDead){
            let idx = index(enemy.x, enemy.y);
            let walls = maze.find(c => c.idx === idx).wall;
            enemy.randomMove(walls);
        }
    }
    tiempo.innerText = counter;
}
function generateGrid(){
    for(let j = 0; j < nrows; j++){
        for(let i = 0; i < ncols; i++){
            let cell = new Cell(i, j, index(i,j));
            grid.push(cell);
        }
    }
}
function generateMaze(){
    let mazeCell = undefined;
    let nCels = ncols*nrows;
    while(maze.length < nCels){
        // first step: we take a cell from the maze:
        // - randomly from the grid if the maze array is empty or
        // - randomly from the maze array
        if(!maze.length){
            let i = Math.floor(grid.length*Math.random());
            mazeCell = grid[i];
            mazeCell.visited = true;
            maze.push(mazeCell);
        }else{
            // find cells that have some neighbours outside the maze
            let frontier = [];
            for(let i = 0; i < maze.length; i++){
                if(maze[i].checkNeighbours(grid)){
                    frontier.push(maze[i].idx);
                }
            }
            let indx = Math.floor(frontier.length*Math.random());
            mazeCell = maze.find(c => c.idx === frontier[indx]);
        }
        // second step: add neighbours to the neighbours array
        mazeCell.addNeighbours(neighbours, grid)
        // third step: randomly take a neighbour, remove a wall,
        // and add it to the maze
        newCell = neighbours.splice(Math.floor(neighbours.length*Math.random()), 1)[0];
        if(newCell){
            newCell.removeWall(maze);
            maze.push(newCell);
            grid[index(newCell.x, newCell.y)].visited = true;
        }
    }
}
function mazeDraw(mazeBuffer){
    mazeBuffer.noFill();
    mazeBuffer.background(bg);
    mazeBuffer.strokeWeight(4);
    mazeBuffer.stroke(0);
    maze.forEach(c => c.show(mazeBuffer));
    image(mazeBuffer, 0, 0);
}
function keyPressed(){
    if(!targetReached && !isDead){
        let idx = index(player.x, player.y);
        let walls = maze.find(c => c.idx === idx).wall;
        switch(keyCode){
            case LEFT_ARROW :
                player.move(-1, 0, walls);
                break;
            case RIGHT_ARROW :
                player.move(1, 0, walls);
                break;
            case UP_ARROW :
                player.move(0, -1, walls);
                break;
            case DOWN_ARROW :
                player.move(0, 1, walls);
                break;
        }
    }
}