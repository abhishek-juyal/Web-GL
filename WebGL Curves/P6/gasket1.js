"use strict";

var gl;
var ctx;
var canvas;
var x1;
var y1;
var x2;
var y2;
var x3;
var y3;
var x4;
var y4;
var n;
var color;

/**
 * init function
 */
function init() {
    // create canvas
    canvas = document.getElementById("gl-canvas");
    ctx = canvas.getContext('2d');
    color = document.getElementById("color").value
};

/**
 * This method sets the values
 */
function setValues() {
    x1 = parseFloat(document.getElementById('x1').value);
    x2 = parseFloat(document.getElementById('x2').value);
    y1 = parseFloat(document.getElementById('y1').value);
    y2 = parseFloat(document.getElementById('y2').value);
    x3 = parseFloat(document.getElementById('x3').value);
    x4 = parseFloat(document.getElementById('x4').value);
    y3 = parseFloat(document.getElementById('y3').value);
    y4 = parseFloat(document.getElementById('y4').value);
    n = parseFloat(document.getElementById('n').value);
}

/**
 * This mehtod creates a line
 */
function HermiteCurve() {
    var i;
    var x, y;
    var delta = 1.0 / n;
    var t;
    PRINT_POINT();
    x = x1;
    y = y1;
    t = 0.0;
    PRINT_TXY(t, x, y);
    for (i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;

        x = ((2 * t3) - (3 * t2) + 1) * x1 + ((-2 * t3) + (3 * t2)) * x4 + (t3 - (2 * t2) + t) * x3 + (t3 - t2) * x4;
        y = ((2 * t3) - (3 * t2) + 1) * y1 + ((-2 * t3) + (3 * t2)) * y4 + (t3 - (2 * t2) + t) * y3 + (t3 - t2) * y4;
        PRINT_TXY(t, x, y);
    }
}

/**
 * BezierCurve
 */
function BezierCurve() {
    var i;
    var x, y;
    var delta = 1.0 / n;
    var t;
    PRINT_POINT();
    x = x1;
    y = y1;
    t = 0.0;
    PRINT_TXY(t, x, y);
    for (i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;

        var q1 = (1 - t);
        var q2 = q1 * q1;
        var q3 = q2 * q1;
        x = q3 * x1 + (3 * t * q2) * x2 + (3 * t2 * q1) * x3 + t3 * x4;
        y = q3 * y1 + (3 * t * q2) * y2 + (3 * t2 * q1) * y3 + t3 * y4;
        PRINT_TXY(t, x, y);
    }
}

/**
 * BSpline
 */
function BSplineCurve() {
    var i;
    var x, y, z;
    var delta = 1.0/n;
    var t;
    x = x1;
    y = y1;
    t = 0.0;
    PRINT_TXY(t,x,y);
    for (i = 0; i < n; i++) {
        t += delta;
        var t2 = t * t;
        var t3 = t2 * t;
        x = (((1-t3)/6)*x1)+(((3*t3-6*t2+4)/6)*x2)+(((-3*t3+3*t2+3*t+1)/6)*x3)+((t3/6)*x4);
        y = (((1-t3)/6)*y1)+(((3*t3-6*t2+4)/6)*y2)+(((-3*t3+3*t2+3*t+1)/6)*y3)+((t3/6)*y4);      
        PRINT_TXY(t,x,y);
    }
}

function BezierCurveP() {
    // Cubic Bézier curve
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    ctx.stroke();
}

/**
 * Clear screen
 */
function clearS() {
    ctx.clearRect(0, 0, 1024, 600);
}

function PRINT_TXY(t, x1, y1) {
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, 1, 1);
}

function PRINT_POINT() {
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, 1, 1);
    ctx.fillRect(x2, y2, 1, 1);
    ctx.fillRect(x3, y3, 1, 1);
    ctx.fillRect(x4, y4, 1, 1);
}

function colorPickerM(){
    color = document.getElementById("color").value
}

window.onload = init;