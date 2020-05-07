"use strict";

var gl;
var ctx;
var canvas;
var x1;
var y1;
var x2;
var y2;
var ex;
var ey;
var ecx;
var ecy;
var radius;
var cx;
var cy;

/**
 * init function
 */
function init() {
    // create canvas
    canvas = document.getElementById("gl-canvas");
    ctx = canvas.getContext('2d');
};

/**
 * This method sets the values
 */
function setValues() {
    //line
    x1 = parseFloat(document.getElementById('x1').value);
    x2 = parseFloat(document.getElementById('x2').value);
    y1 = parseFloat(document.getElementById('y1').value);
    y2 = parseFloat(document.getElementById('y2').value);
    // eclipse
    ex = parseFloat(document.getElementById('ex').value);
    ey = parseFloat(document.getElementById('ey').value);
    ecx = parseFloat(document.getElementById('ecx').value);
    ecy = parseFloat(document.getElementById('ecy').value);
    //circle
    radius = parseFloat(document.getElementById('r').value);
    cx = parseFloat(document.getElementById('cx').value);
    cy = parseFloat(document.getElementById('cy').value);
}

/**
 * This mehtod creates a line
 */
function MidpointLine() {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var d = 2 * dy - dx;
    var incrE = 2 * dy;
    var incrNE = 2 * (dy - dx);
    var xl = x1;
    var yl = y1;
    ctx.fillRect(xl, yl, 1, 1);
    while (parseFloat(xl) < parseFloat(x2)) {
        if (d <= 0) {
            d = d + incrE;
            x1++;
        }
        else {
            d = d + incrNE;
            xl++;
            yl++;
        }
        ctx.fillRect(xl, yl, 1, 1);
    }
}

function MidpointCircle() {
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;

    while (x >= y) {
        DrawPixel(x + cx, y + cy);
        DrawPixel(y + cx, x + cy);
        DrawPixel(-x + cx, y + cy);
        DrawPixel(-y + cx, x + cy);
        DrawPixel(-x + cx, -y + cy);
        DrawPixel(-y + cx, -x + cy);
        DrawPixel(x + cx, -y + cy);
        DrawPixel(y + cx, -x + cy);
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

var DrawPixel = function (x, y) {
    ctx.fillRect(x, y, 1, 1);
}

function DDALine() {
    var xl;

    var dy = parseFloat(y2 - y1);
    var dx = parseFloat(x2 - x1);
    var m = parseFloat(dy / dx);
    var yl = y1;

    for (xl = x1; xl <= x2; xl++) {
        ctx.fillRect(xl, yl, 1, 1);
        yl = parseFloat(yl) + parseFloat(m);
    }
}

function ellipsePlotPoints(ecx, ecy, x, y) {
    DrawPixel(ecx + x, ecy + y);
    DrawPixel(ecx - x, ecy + y);
    DrawPixel(ecx + x, ecy - y);
    DrawPixel(ecx - x, ecy - y);
}

function MidpointEllipse() {
    var a = ex;
    var b = ey;
    var a2 = a * a;
    var b2 = b * b;
    var twoa2 = 2 * a2;
    var twob2 = 2 * b2;
    var p;
    var x = 0;
    var y = b;
    var px = 0;
    var py = twoa2 * y;

    /* Plot the initial point in each quadrant. */
    ellipsePlotPoints(ecx, ecy, x, y);

    /* Region 1 */
    p = Math.round(b2 - (a2 * b) + (0.25 * a2));
    while (px < py) {
        x++;
        px += twob2;
        if (p < 0)
            p += b2 + px;
        else {
            y--;
            py -= twoa2;
            p += b2 + px - py;
        }
        ellipsePlotPoints(ecx, ecy, x, y);
    }

    /* Region 2 */
    p = Math.round(b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2);
    while (y > 0) {
        y--;
        py -= twoa2;
        if (p > 0)
            p += a2 - py;
        else {
            x++;
            px += twob2;
            p += a2 - py + px;
        }
        ellipsePlotPoints(ecx, ecy, x, y);
    }
}

function EllipsePoints(xl, yl) {
    ctx.fillRect(xl, yl, 1, 1);
    ctx.fillRect(-xl, yl, 1, 1);
    ctx.fillRect(xl, -yl, 1, 1);
    ctx.fillRect(-xl, -yl, 1, 1);
}

function clearS() {
    ctx.clearRect(0, 0, 1024, 600);
}

function createCircle() {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.stroke();
}

function createLine() {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

window.onload = init;