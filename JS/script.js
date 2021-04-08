var canvas = document.getElementById('canvas'),
    pSize = 5, // pixel size
    ctx = canvas.getContext('2d'),
    imgd, defaultCanvas,
    isDrawing,
    position;

function drawGrid() {
    // vẽ lưới tọa độ
    ctx.fillStyle = '#000000';
    for (let i = 0; i < canvas.height; i += pSize) {
        for (let j = 0; j < canvas.width; j++) {
            ctx.fillRect(j, i, 1, 1);
        }
    }
    for (let i = 0; i < canvas.width; i += pSize) {
        for (let j = 0; j < canvas.height; j++) {
            ctx.fillRect(i, j, 1, 1);
        }
    }
    // vẽ hệ tọa độ
    ctx.fillStyle = '#2e89ff';
    let x = canvas.width / 2,
        y = canvas.height / 2;

    for (let i = 0; i < canvas.height; i++) {
        ctx.fillRect(x, i, 1, 1);
    }
    for (let i = 0; i < canvas.width; i++) {
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

function getPixelPos(x, y) {
    return {
        x: (Math.ceil(x / pSize) - 1) * pSize + 1,
        y: (Math.ceil(y / pSize) - 1) * pSize + 1
    }
}

function fillPixel(x, y) {
    x = (Math.ceil(x / pSize) - 1) * pSize + 1;
    y = (Math.ceil(y / pSize) - 1) * pSize + 1;
    ctx.fillRect(x, y, pSize - 1, pSize - 1);
}

function putPixel(x, y) {
    ctx.fillRect((x - 1) * pSize + 1, (y - 1) * pSize + 1, pSize - 1, pSize - 1);
}

function drawLine(x0, y0, x1, y1) {
    // DDA algorithm
    const dx = x1 - x0,
        dy = y1 - y0,
        s = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy),
        xi = dx * 1.0 / s,
        yi = dy * 1.0 / s;
    var x = x0,
        y = y0;

    fillPixel(x0, y0);
    for (let i = 0; i < s; i++) {
        x += xi;
        y += yi;
        fillPixel(x, y);
    }
}

function bresenhamLine(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    for (x = x1; x <= x2; x++) {
        putPixel(x, y);
        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dashedLine(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2;
    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if (dem > chieuDaiMoiDoan + khoangCachMoiDoan) {
                //reset bien dem
                dem = 1;
                putPixel(x, y);
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dashDotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2

    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if ((dem > chieuDaiMoiDoan && dem <= chieuDaiMoiDoan + khoangCachMoiDoan) || (dem > chieuDaiMoiDoan + khoangCachMoiDoan + 1 && dem <= chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 1)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else {
                if (dem == chieuDaiMoiDoan + khoangCachMoiDoan + 1) {
                    putPixel(x, y); //vẽ chấm
                }
                else {
                    dem = 1;
                    putPixel(x, y);
                }
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dash2DotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2

    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if ((dem > chieuDaiMoiDoan && dem <= chieuDaiMoiDoan + khoangCachMoiDoan)
                || (dem > chieuDaiMoiDoan + khoangCachMoiDoan + 1 && dem <= chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 1)
                || (dem > chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 2 && dem <= chieuDaiMoiDoan + 3 * khoangCachMoiDoan + 2)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else {
                if ((dem == chieuDaiMoiDoan + khoangCachMoiDoan + 1) || (dem == chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 2)) {
                    putPixel(x, y); //vẽ chấm
                }
                else {
                    dem = 1;
                    putPixel(x, y);
                }
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function drawArrow(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    for (x = x1; x <= x2; x++) {
        putPixel(x, y);
        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
    putPixel(x2 - 1, y2 - 1);
    putPixel(x2 - 1, y2 + 1);
}

function drawRectangle(x, y, w, h) {
    let x1 = x + w,
        y1 = y + h;
    drawLine(x, y, x1, y);
    drawLine(x1, y, x1, y1);
    drawLine(x1, y1, x, y1);
    drawLine(x, y1, x, y);
}

function drawCircle(x0, y0, radius) {
    // mid-point algorithm
    var x = radius,
        y = 0,
        radiusError = 1 - x;

    while (x >= y) {
        fillPixel(x + x0, y + y0);
        fillPixel(y + x0, x + y0);
        fillPixel(-x + x0, y + y0);
        fillPixel(-y + x0, x + y0);
        fillPixel(-x + x0, -y + y0);
        fillPixel(-y + x0, -x + y0);
        fillPixel(x + x0, -y + y0);
        fillPixel(y + x0, -x + y0);
        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError += 2 * (y - x + 1);
        }
    }
}

canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    console.log(position);
});

canvas.addEventListener('mousedown', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    isDrawing = true;
});

canvas.addEventListener('mousemove', function (evt) {
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        realPos = getMousePos(canvas, evt);
        position = getPixelPos(realPos.x, realPos.y);
    }
});

window.addEventListener('mouseup', function (evt) {
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        position = { x: 0, y: 0 };
        isDrawing = false;
    }
});

document.getElementById('testBtn').addEventListener('click', function(evt) {
    ctx.fillStyle = '#' + Math.random().toString(16).slice(-6);
});

document.getElementById('clearBtn').addEventListener('click', function (evt) {
    if (imgd != null) {
        ctx.putImageData(imgd, 0, 0);
    } else {
        ctx.putImageData(defaultCanvas, 0, 0);
    }
});

document.getElementById('saveBtn').addEventListener('click', function (evt) {
    imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

document.getElementById('resetBtn').addEventListener('click', function (evt) {
    ctx.putImageData(defaultCanvas, 0, 0);
});


