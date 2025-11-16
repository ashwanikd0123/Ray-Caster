// util functions
function print(msg) {
    console.log(msg)
}

function cleanCanvas(context) {
    context.fillStyle = "black"
    context.fillRect(0, 0, width, height)
}

// get canvas element
var canvas = $("#main-canvas")[0]

// get width and height from canvas
const width = canvas.width
const height = canvas.height

// get context from canvas
var context = canvas.getContext("2d")
cleanCanvas(context)

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

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const TILE_SIZE = 10;

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
    cleanCanvas(context)

    // draw walls
    context.fillStyle = wallColor
    for (let r = 0; r < MAP_HEIGHT; r++) {
        for (let c = 0; c < MAP_WIDTH; c++) {
            if (worldMap[r][c] === 1) {
                context.fillRect(
                    c * TILE_SIZE,
                    r * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                )
            }
        }
    }

    // draw player
    context.fillStyle = playerColor
    context.beginPath()
    context.arc(player.x, player.y, 2, 0, Math.PI * 2 )
    context.fill()

    // draw player direction line
    context.strokeStyle = playerLineColor
    context.beginPath()
    context.moveTo(player.x, player.y)
    context.lineTo(
        player.x + Math.cos(player.angle) * playerlineLen,
        player.y + Math.sin(player.angle) * playerlineLen
    )
    context.stroke()

    
}

// animation loop
function loop() {
    update()
    draw()
    requestAnimationFrame(loop)
}

loop()