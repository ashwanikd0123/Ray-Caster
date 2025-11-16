// util functions
function print(msg) {
    console.log(msg)
}

function cleanCanvas(context) {
    context.fillStyle = "black"
    context.fillRect(0, 0, width, height)
}

// get canvas element
var mainCanvas = $("#main-canvas")[0]
var viewCanvas = $("#view-canvas")[0]

// get width and height from canvas
const width = mainCanvas.width
const height = mainCanvas.height

// get context from canvas
var mainContext = mainCanvas.getContext("2d")
var viewContext = viewCanvas.getContext("2d")

const keyPress = {
    up: false,
    down: false,
    left: false,
    right: false
}

// adding key listeners
$(document).keydown(function(event) {
    switch (event.key) {
        case "w":
            keyPress.up = true
            break
        case "s":
            keyPress.down = true
            break
        case "a":
            keyPress.left = true
            break
        case "d":
            keyPress.right = true
            break
    }
})

$(document).keyup(function(event) {
    switch (event.key) {
        case "w":
            keyPress.up = false
            break
        case "s":
            keyPress.down = false
            break
        case "a":
            keyPress.left = false
            break
        case "d":
            keyPress.right = false
            break
    }
})

// adding elements
const worldMap = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;

function getTileSize() {
    if (width < height) {
        return Math.floor(width / MAP_WIDTH)
    }
    return Math.floor(height / MAP_HEIGHT)
}

const TILE_SIZE = width / MAP_WIDTH;

const player = {
    x: TILE_SIZE * 2.5,
    y: TILE_SIZE * 2.5,
    angle: -Math.PI / 2,
    speed: 1.0,
    rotationSpeed: 0.05
}

const playerColor = "yellow"
const playerLineColor = "yellow"

const wallColor = "gray"

const playerlineLen = 10

// check if position is wall
function isWall(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
        return true;
    }
    return worldMap[tileY][tileX] === 1;
}

// update player position
function update() {
    if (keyPress.up) {
        const nextX = player.x + Math.cos(player.angle) * player.speed;
        const nextY = player.y + Math.sin(player.angle) * player.speed;
        if (!isWall(nextX, nextY)) {
            player.x = nextX;
            player.y = nextY;
        }
    }

    if (keyPress.down) {
        const nextX = player.x - Math.cos(player.angle) * player.speed;
        const nextY = player.y - Math.sin(player.angle) * player.speed;
        if (!isWall(nextX, nextY)) {
            player.x = nextX;
            player.y = nextY;
        }
    }

    if (keyPress.left) {
        player.angle -= player.rotationSpeed
    }

    if (keyPress.right) {
        player.angle += player.rotationSpeed
    }

    if (player.x < 0) player.x = 0;
    if (player.x > width) player.x = width;
    if (player.y < 0) player.y = 0;
    if (player.y > height) player.y = height;
}

// draw function
function draw() {
    cleanCanvas(mainContext)

    // draw walls
    mainContext.fillStyle = wallColor
    for (let r = 0; r < MAP_HEIGHT; r++) {
        for (let c = 0; c < MAP_WIDTH; c++) {
            if (worldMap[r][c] === 1) {
                mainContext.fillRect(
                    c * TILE_SIZE,
                    r * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                )
            }
        }
    }

    // draw player
    mainContext.fillStyle = playerColor
    mainContext.beginPath()
    mainContext.arc(player.x, player.y, 2, 0, Math.PI * 2 )
    mainContext.fill()

    // draw player direction line
    mainContext.strokeStyle = playerLineColor
    mainContext.beginPath()
    mainContext.moveTo(player.x, player.y)
    mainContext.lineTo(
        player.x + Math.cos(player.angle) * playerlineLen,
        player.y + Math.sin(player.angle) * playerlineLen
    )
    mainContext.stroke()

    // draw view canvas border
    cleanCanvas(viewContext)
    
}

// animation loop
function loop() {
    update()
    draw()
    requestAnimationFrame(loop)
}

loop()