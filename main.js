let grid = [];
let neighbours = [];
let maze = [];
let vSize = 640;
let hSize = 800;
let wallSize = 40;
let ncols = Math.floor(hSize/wallSize);
let nrows = Math.floor(vSize/wallSize);
let player;
let playerImg;
let targetImg;
let bg;
let mazeCanvas;
let heart;
let heartImg;
let fireImg;
let counter = 35;
let isDead = false;
let tiempo;
let targetReached = false;

function preload(){
    bg = loadImage('./fondo.jpg');
    playerImg = loadImage('./jolmos.png');
    targetImg = loadImage('./pui.png');
    heartImg = loadImage('./corazon.png');
    fireImg = loadImage('./fuego.jpg');
}
function setup(){
    const can = createCanvas(hSize+1, vSize+1);
    can.parent(document.getElementById("canvasContainer"));
    tiempo = document.getElementById("tiempo");
    mazeCanvas = createGraphics(hSize, vSize);
    heartImg.resize(150,0);
    fireImg.resize(hSize, 0);
    heart = new Heart((ncols-1)*wallSize, (nrows-1)*wallSize, heartImg);
    player = new Player(0, 0, ncols-1, nrows-1, playerImg);
    noFill();
    generateGrid();
    generateMaze();
    mazeDraw(mazeCanvas);
}
function draw(){
    image(mazeCanvas, 0, 0);
    player.show();
    targetReached = player.reachTarget();
    if(targetReached){
        heart.show();
    }
    if(!targetReached && frameCount%60 === 0){
        counter--;
        isDead = counter === 0;
    }
    if(isDead){
        image(fireImg, 0, 0);
        noLoop();
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
    mazeCanvas.image(targetImg, (ncols-1)*wallSize, (nrows-1)*wallSize);
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