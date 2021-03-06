import io from 'socket.io-client'

let mShape = "ellipse",
    mWidth = 50,
    mHeight = 50,
    mColor = '#000000',
    canvasHover = false,
    buffer = [],
    mStroke = true,
    mStrokeColor = '#000000',
    mStrokeWeight = 1,
    initDone = false,
    initPage,
    socket = io.connect('http://127.0.0.1:3000')

window.setup = () => {
    ellipseMode(CENTER)
    let canvas = createCanvas(640, 480)
    canvas.parent('sketch-holder')
}

window.draw = () => {
    if( !initDone && initPage != undefined ){
      initPage.forEach(m => {
        setMotif(m)
        })
      initDone = true
    }

    if(canvasHover && mouseIsPressed) {
        let myX = mouseX,
            myY = mouseY;
        let motif = {
            shape: mShape,
            color: mColor,
            x: myX,
            y: myY,
            width: mWidth,
            height: mHeight,
            stroke: mStroke,
            strokeColor: mStrokeColor,
            strokeWeight: mStrokeWeight
        }

        setMotif(motif)

        socket.emit('draw_motif', {
            motif
        })
    }

    let motif = buffer.shift()
    if (motif) {
        setMotif(motif)
    }
}

window.setMotif = (motif) => {
    if (motif.stroke) {
        stroke(motif.strokeColor)
        strokeWeight(motif.strokeWeight)
    } else {
        noStroke()
    }

    fill(motif.color)

    switch (motif.shape) {
        case "ellipse":
            ellipse(motif.x, motif.y, motif.width, motif.height)
            break;
        case "rect":
            rect(motif.x, motif.y, motif.width, motif.height)
            break;
        default:
            rect(motif.x, motif.y, motif.width, motif.height)
    }
    fill(mColor)
}

socket.on('draw_motif', function(data) {
    buffer.push(data.motif)
})

socket.on('clear_page', function(data) {
    clear()
})

socket.on('init_page', function(data) {
    initPage = data.page
})


window.onload = function() {
    document.getElementById("motif-color").addEventListener("input", function() {
        mColor = this.value
    })
    document.getElementById("motif-shape-ellipse").addEventListener("click", function() {
        mShape = this.value
    })
    document.getElementById("motif-shape-rectangle").addEventListener("click", function() {
        mShape = this.value
    })
    document.getElementById("motif-width").addEventListener("input", function() {
        mWidth = parseInt(this.value);
    })
    document.getElementById("motif-height").addEventListener("input", function() {
        mHeight = parseInt(this.value);
    })
    document.getElementById("clear-page").addEventListener("click", function() {
        socket.emit('clear_page', {
            clearer: ""
        })
    })
    document.getElementById("motif-stroke").addEventListener("click", function() {
        mStroke = true
    })
    document.getElementById("motif-stroke-color").addEventListener("input", function() {
        mStrokeColor = this.value
    })
    document.getElementById("motif-stroke-weight").addEventListener("input", function() {
        mStrokeWeight = this.value
    })
    document.getElementById("motif-no-stroke").addEventListener("click", function() {
        mStroke = false
    })
    window.setHover = (state) => {
        canvasHover = state
    }
}
