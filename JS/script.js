var canvas = document.getElementById('canvas'),
    pSize = 5, // pixel size
    ctx = canvas.getContext('2d'),
    imgd, defaultCanvas,
    isDrawing,
    position;

function drawGrid() {
    // vẽ lưới tọa độ
    ctx.fillStyle = '#000000'
    for(let i = 0; i < canvas.height; i += pSize) {
        for(let j = 0; j < canvas.width; j++) {
            ctx.fillRect(j, i, 1, 1);
        }
    }
    for(let i = 0; i < canvas.width; i += pSize) {
        for(let j = 0; j < canvas.height; j++) {
            ctx.fillRect(i, j, 1, 1);
        }
    }
    // vẽ hệ tọa độ
    ctx.fillStyle = '#2e89ff';
    let x = canvas.width/2,
        y = canvas.height/2;

    for(let i = 0; i < canvas.height; i++) {
        ctx.fillRect(x, i, 1, 1);
    }
    for(let i = 0; i < canvas.width; i++) {
        ctx.fillRect(i, y, 1, 1);
    }
    defaultCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getPixelPos(a, b) {
    return {
        x: (Math.ceil(a / pSize) - 1) * pSize,
        y: (Math.ceil(b / pSize) - 1) * pSize
    }
}

function fillPixel(x, y) {
    ctx.fillRect(x, y, pSize, pSize);
}

function drawLine(x1, y1, x2, y2) {
    console.log(arguments);
    if(x1 > x2) {
        [x1, y1, x2, y2] = [x2, y2, x1, y1];
    }
    dx = x2 - x1;
    dy = y2 - y1;

    for(let x = x1; x < x2; x++) {
        y = y1 + dy * (x - x1) / dx;
        pos = getPixelPos(x, y);
        fillPixel(pos.x, pos.y);
    }
}

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    console.log(position);
});

canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    isDrawing = true;
});

canvas.addEventListener('mousemove', function(evt) {
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        realPos = getMousePos(canvas, evt);
        position = getPixelPos(realPos.x, realPos.y);
    }
});

window.addEventListener('mouseup', function(evt){
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        position = {x: 0, y: 0};
        isDrawing = false;
    }
});

document.getElementById('testBtn').addEventListener('click', function(evt) {
    drawLine(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height
        );

});

document.getElementById('clearBtn').addEventListener('click', function(evt) {
    if(imgd != null) {
        ctx.putImageData(imgd, 0, 0);
    } else {
        ctx.putImageData(defaultCanvas, 0, 0);
    }
});

document.getElementById('saveBtn').addEventListener('click', function(evt) {
    imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

document.getElementById('resetBtn').addEventListener('click', function(evt) {
    ctx.putImageData(defaultCanvas, 0, 0);
});
