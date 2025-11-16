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

