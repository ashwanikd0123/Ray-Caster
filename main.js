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
const player = {
    x: width / 2,
    y: height / 2,
    angle: -Math.PI / 2,
    speed: 1.0,
    rotationSpeed: 0.05
}

// update player position
function update() {
    if (keyPress.up) {
        player.x += Math.cos(player.angle) * player.speed
        player.y += Math.sin(player.angle) * player.speed
    }
    if (keyPress.down) {
        player.x -= Math.cos(player.angle) * player.speed
        player.y -= Math.sin(player.angle) * player.speed
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

    // draw player
    context.fillStyle = "white"
    context.beginPath()
    context.arc(player.x, player.y, 2, 0, Math.PI * 2 )
    context.fill()
}

// animation loop
function loop() {
    update()
    draw()
}

requestAnimationFrame(loop)
