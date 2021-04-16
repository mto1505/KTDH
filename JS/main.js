window.onload = function () {
    drawGrid();

    document.querySelectorAll('.dropdown-content > div').forEach((ele) => {
        switch (ele.id) {
            case 'BT1':
                console.log('Not implemented');
                break;
            case 'BT2':
                ele.addEventListener('click', (evt) => {
                    dashedLine(5, 10, 40, 10);
                    dashDotLine(5, 20, 40, 20);
                    dash2DotLine(5, 30, 40, 30);
                    drawArrow(5, 40, 40, 40);
                    drawRectangle(300, 300, 100, 200);
                });
                break;
            case 'BT3':
                ele.addEventListener('click', (evt) => {
                    dashCircle(50,50,25);
                });
                break;
            default:
                console.log('Not implemented');
        }
    })
}
