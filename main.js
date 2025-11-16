// util functions
function print(msg) {
    console.log(msg)
}

function cleanCanvas(context) {
    context.fillStyle = "black"
    context.fillRect(0, 0, WIDTH, HEIGHT)
}

// get canvas element
var mainCanvas = $("#main-canvas")[0]
var viewCanvas = $("#view-canvas")[0]

// get width and height from canvas
const WIDTH = mainCanvas.width
const HEIGHT = mainCanvas.height

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
        case "ArrowUp":
            keyPress.up = true
            break
        case "s":
        case "ArrowDown":
            keyPress.down = true
            break
        case "a":
        case "ArrowLeft":
            keyPress.left = true
            break
        case "d":
        case "ArrowRight":
            keyPress.right = true
            break
    }
})

$(document).keyup(function(event) {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            keyPress.up = false
            break
        case "s":
        case "ArrowDown":
            keyPress.down = false
            break
        case "a":
        case "ArrowLeft":
            keyPress.left = false
            break
        case "d":
        case "ArrowRight":
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
    if (WIDTH < HEIGHT) {
        return Math.floor(WIDTH / MAP_WIDTH)
    }
    return Math.floor(HEIGHT / MAP_HEIGHT)
}

const TILE_SIZE = getTileSize();

const player = {
    x: TILE_SIZE * 2.5,
    y: TILE_SIZE * 2.5,
    angle: -Math.PI / 2,
    speed: 1.0,
    rotationSpeed: 0.05
}

const playerColor = "yellow"
const playerLineColor = "yellow"

const wallColor = "white"

const playerlineLen = 20
const playerRadius = 5

var fov = Math.PI / 3;        // 60 deg
const NUM_RAYS = WIDTH;     // 1 ray per column (simple)

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
    if (player.x > WIDTH) player.x = WIDTH;
    if (player.y < 0) player.y = 0;
    if (player.y > HEIGHT) player.y = HEIGHT;
}

function drawMainContent() {
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
    mainContext.arc(player.x, player.y, playerRadius, 0, Math.PI * 2 )
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
}

function castRay(angle) {
    const MAX_DEPTH = TILE_SIZE * MAP_WIDTH * 2;
    const stepSize = 1;

    let dist = 0;
    let hitX = player.x;
    let hitY = player.y;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    while (dist < MAX_DEPTH) {
        hitX = player.x + cos * dist;
        hitY = player.y + sin * dist;

        if (isWall(hitX, hitY)) {
            break;
        }

        dist += stepSize;
    }

    return {dist, hitX, hitY};
}

// optional debug rays on top-down map
function drawRaysOnMap() {
    const startAngle = player.angle - fov / 2;
    const angleStep = fov / NUM_RAYS;

    
    for (let i = 0; i < NUM_RAYS; i += 4) { // skip some for clarity
        const rayAngle = startAngle + i * angleStep;
        const { hitX, hitY } = castRay(rayAngle);

        mainContext.strokeStyle = "green";
        mainContext.beginPath();
        mainContext.moveTo(player.x, player.y);
        mainContext.lineTo(hitX, hitY);
        mainContext.stroke();
    }
}

var fishEyeCorrection = true
var shadingEnabled = true;

function drawViewContent() {
    cleanCanvas(viewContext)

    const startAngle = player.angle - fov / 2;
    const angleStep = fov / NUM_RAYS;

    for (let ray = 0; ray < NUM_RAYS; ray++) {
        const rayAngle = startAngle + ray * angleStep;
        const { dist } = castRay(rayAngle); // get distance to wall

        // correct fisheye distortion effect
        var correctedDist = dist * Math.cos(rayAngle - player.angle);
        if (!fishEyeCorrection) {
            correctedDist = dist;
        }
        
        const lineHeight = (TILE_SIZE * HEIGHT) / correctedDist;

        const columnX = ray; // 1 column per ray
        const columnHeight =  Math.min(lineHeight, HEIGHT);
        const columnY = (HEIGHT - columnHeight) / 2;

        let shade = 255 - Math.min(255, Math.floor(correctedDist * 0.5));
        viewContext.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        if (!shadingEnabled) {
            viewContext.fillStyle = wallColor;
        }
        viewContext.fillRect(columnX, columnY, 1, columnHeight);
    }
}

// draw function
function draw() {
    // draw left canvas
    drawMainContent()
    drawRaysOnMap()
    // draw right canvas
    drawViewContent()
}

// animation loop
function loop() {
    update()
    draw()
    requestAnimationFrame(loop)
}

loop()

// setting extra listeners

$("#fish-eye-checkbox").change(function() {
    fishEyeCorrection = this.checked
})

$("#fish-eye-checkbox").prop("checked", fishEyeCorrection)

$("#shading-checkbox").change(function() {
    shadingEnabled = this.checked
})

$("#shading-checkbox").prop("checked", shadingEnabled)

function randomizeMap() {
    for (let r = 1; r < MAP_HEIGHT - 1; r++) {
        for (let c = 1; c < MAP_WIDTH - 1; c++) {
            if (r === Math.floor(player.y / TILE_SIZE) && c === Math.floor(player.x / TILE_SIZE)) {
                worldMap[r][c] = 0; // ensure player position is empty
            }
            worldMap[r][c] = Math.random() < 0.3 ? 1 : 0; // 30% chance of wall
        }   
    }
}

$("#reset-map-button").click(function() {
    randomizeMap()
})

const slider = document.getElementById("fov");
const output = document.getElementById("fov-value");

slider.value = fov * (180 / Math.PI);

// Display the initial slider value
output.innerHTML = slider.value;

// Update the output as the slider value changes
slider.oninput = function() {
  output.innerHTML = this.value;
  fov = (this.value * Math.PI) / 180; // convert degrees to radians
}