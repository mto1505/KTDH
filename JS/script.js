var canvas = document.getElementById('canvas'),
    pSize = 5, // pixel size
    ctx = canvas.getContext('2d'),
    imgd, defaultCanvas,
    isDrawing,
    position;

function drawGrid() {
    // vẽ lưới tọa độ
    ctx.fillStyle = '#000000';
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
        setTimeout(function(){


        }, 1000); 
    }
    for(let i = 0; i < canvas.width; i++) {
        ctx.fillRect(i, y, 1, 1);
        setTimeout(function(){


        }, 1000); 
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
    pos = getPixelPos(x, y);
    ctx.fillRect(pos.x, pos.y, pSize, pSize);
}
function putPixel(x, y) {
    ctx.fillRect((x-1)*pSize, (y-1)*pSize, pSize, pSize);
}

function drawLine(x0, y0, x1, y1) {
    // DDA algorithm
    const dx = x1 - x0,
          dy = y1 - y0,
          s  = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy),
          xi = dx * 1.0 / s,
          yi = dy * 1.0 / s;
    var x  = x0,
        y  = y0;

    fillPixel(x0, y0);

    for (let i = 0; i < s; i++) {
        x += xi;
        y += yi;
        fillPixel(x, y);
    }
}

function bresenhamLine(x1, y1, x2, y2) {
    var x, y, dx, dy,p,const1,const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2*dy - dx;
    const1 = 2*dy;
    const2 = 2*(dy-dx);
    for (x=x1; x<=x2; x++) {
     putPixel(x, y);
     if (p < 0)
     p += const1; // p=p + 2dy
     else {
     p +=const2; //p=p+2dy-2dx
     y++;
     }
     }
    }
function dashedLine(x1, y1, x2, y2) {
    var x, y, dx, dy,p,const1,const2,dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2*dy - dx;
    const1 = 2*dy;
    const2 = 2*(dy-dx);
    dem=0;
    chieuDaiMoiDoan=6;
    khoangCachMoiDoan=2;
    for (x=x1; x<=x2; x++) {
     dem++;
     if (dem<=chieuDaiMoiDoan) putPixel(x, y);
     else
     {
         if (dem>chieuDaiMoiDoan+khoangCachMoiDoan)
         {
            //reset bien dem
            dem=1;
            putPixel(x,y);
         }
     }

     if (p < 0)
     p += const1; // p=p + 2dy
     else {
     p +=const2; //p=p+2dy-2dx
     y++;
     }
     }
}
function dashDotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy,p,const1,const2,dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2*dy - dx;
    const1 = 2*dy;
    const2 = 2*(dy-dx);
    dem=0;
    chieuDaiMoiDoan=6;
    khoangCachMoiDoan=2

    for (x=x1; x<=x2; x++) {
        dem++;
        if (dem<=chieuDaiMoiDoan) putPixel(x, y);
        else
        {
            if ((dem>chieuDaiMoiDoan && dem<=chieuDaiMoiDoan+khoangCachMoiDoan)||(dem>chieuDaiMoiDoan+khoangCachMoiDoan+1&&dem<=chieuDaiMoiDoan+2*khoangCachMoiDoan+1)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else
            {
                if (dem==chieuDaiMoiDoan+khoangCachMoiDoan+1)
                {
                    putPixel(x,y); //vẽ chấm
                }
                else
                {
                    dem=1;
                    putPixel(x,y);
                }
            }
        }
        
        if (p < 0)
        p += const1; // p=p + 2dy
        else {
        p +=const2; //p=p+2dy-2dx
        y++;
        }
    }
}       

function dash2DotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy,p,const1,const2,dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2*dy - dx;
    const1 = 2*dy;
    const2 = 2*(dy-dx);
    dem=0;
    chieuDaiMoiDoan=6;
    khoangCachMoiDoan=2

    for (x=x1; x<=x2; x++) {
        dem++;
        if (dem<=chieuDaiMoiDoan) putPixel(x, y);
        else
        {
            if ((dem>chieuDaiMoiDoan && dem<=chieuDaiMoiDoan+khoangCachMoiDoan)
            ||(dem>chieuDaiMoiDoan+khoangCachMoiDoan+1&&dem<=chieuDaiMoiDoan+2*khoangCachMoiDoan+1)
            ||(dem>chieuDaiMoiDoan+2*khoangCachMoiDoan+2&&dem<=chieuDaiMoiDoan+3*khoangCachMoiDoan+2)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else
            {
                if ((dem==chieuDaiMoiDoan+khoangCachMoiDoan+1)||(dem==chieuDaiMoiDoan+2*khoangCachMoiDoan+2))
                {
                    putPixel(x,y); //vẽ chấm
                }
                else
                {
                    dem=1;
                    putPixel(x,y);
                }
            }
        }
        
        if (p < 0)
        p += const1; // p=p + 2dy
        else {
        p +=const2; //p=p+2dy-2dx
        y++;
        }
    }
}    

function drawArrow(x1, y1, x2, y2) {
    var x, y, dx, dy,p,const1,const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2*dy - dx;
    const1 = 2*dy;
    const2 = 2*(dy-dx);
    for (x=x1; x<=x2; x++) {
     putPixel(x, y);
     if (p < 0)
     p += const1; // p=p + 2dy
     else {
     p +=const2; //p=p+2dy-2dx
     y++;
     }
     }
     putPixel(x2-1,y2-1);
     putPixel(x2-1,y2+1);
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
    ctx.fillStyle = '#' + Math.random().toString(16).slice(-6);

    // drawLine(
    //     Math.random() * canvas.width,
    //     Math.random() * canvas.height,
    //     Math.random() * canvas.width,
    //     Math.random() * canvas.height
    //     );
    let x = Math.random() * canvas.width,
        y = Math.random() * canvas.height,
        m = Math.random() * (canvas.width/5),
        n = Math.random() * (canvas.height/5);
        p = Math.random() * (canvas.width/5),
        q = Math.random() * (canvas.height/5);
    //console.log(Math.round(x),Math.round(y),Math.round(z),Math.round(t));
    // for (var i=1; i<=160; i++)
    // {
    //     for (var j=1;j<=100;j++)
    //     {
    //         putPixel(i,j);
    //     }
    // }
    dashedLine(Math.round(m),Math.round(n),Math.round(p),Math.round(q));
    // dashDotLine(Math.round(m),Math.round(n),Math.round(p),Math.round(q));
    // dash2DotLine(Math.round(m),Math.round(n),Math.round(p),Math.round(q));
    // drawArrow(Math.round(m),Math.round(n),Math.round(p),Math.round(n));
    // drawRectangle(
    //     x, y,
    //     Math.random() * (canvas.width),
    //     Math.random() * (canvas.height)
    //     );
    // drawCircle(
    //     x, y,
    //     Math.random() * canvas.height
    //     );
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
