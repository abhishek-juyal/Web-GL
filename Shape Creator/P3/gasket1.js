"use strict";

var gl;
var ctx;
var canvas;
var angle = 10;
var rectWidth = 150;
var rectHeight = 100;
var drawCircle = false;
var drawCircleCounter = 0;
var drawTriangle = false;
var drawTriangleCounter = 0;
var drawRectangle = false;
var drawPolygon = 0;
var drawRectangleCounter = 0;
var drawPolygonCounter = 0;
var drawLine = false;
var drawLineCounter = 0;
var recX = 25;
var recY = 25;
var traingleX = 125;
var triangleY = 125;
var circleX = 75;
var circleY = 75;
var lineX = 25;
var lineY = 25;
var polygonX = 25;
var polygonY = 25;
var recTranslateX;
var recTranslateY;
var triangleTranslateX;
var triangleTranslateY;
var circleTranslateX;
var circleTranslateY;
var lineTranslateX;
var lineTranslateY;
var polygonTranslateX;
var polygonTranslateY;
var recRotate;
var triangleRotate;
var circleRotate;
var lineRotate;
var polygonRotate;
var recScaleX;
var recScaleY;
var polygonScaleX;
var polygonScaleY;
var triangleScaleX;
var triangleScaleY;
var circleScaleX;
var circleScaleY;
var lineScaleX;
var lineScaleY;


/**
 * init function
 */
function init() {
    // create canvas
    canvas = document.getElementById("gl-canvas");
    ctx = canvas.getContext('2d');
};

/**
 * this method sets the value and makes call to everything
 */
function magic() {
    ctx.save();
    ctx.clearRect(0, 0, 1024, 600);
    /**
     * draw circle
     */
    circle();
    ctx.restore();
    /**
     * draw rectangle
     */
    ctx.save();
    rectangle();
    ctx.restore();
    /**
     * draw Line
     */
    ctx.save();
    line();
    ctx.restore();
    /**
     * draw Triangle
     */ 
    ctx.save();
    triangle();
    ctx.restore();
    /**
    * draw polygon
    */
    ctx.save();
    polygon();
    ctx.restore();
}

/**
 *  draw circle
 */
function circle() {
    if (drawCircle && drawCircleCounter != 1) {
        // translate in case we have clicked the circle and want to change position
        circleTranslateX = document.getElementById('translateX').value;
        circleTranslateY = document.getElementById('translateY').value;
        ctx.translate(circleTranslateX, circleTranslateY);

        // rotate in case we have clicked the circle and want to change position
        circleRotate = document.getElementById('rotateS').value;
        rotate(circleRotate);

        //scale
        circleScaleX = document.getElementById('scaleX').value;
        circleScaleY = document.getElementById('scaleY').value;
        ctx.scale(circleScaleX, circleScaleY);


        // create Circle
        createCircle();

        //dicard all the change for circle
        ctx.translate(-(circleTranslateX), -(circleTranslateY));
    }
    else if (!drawCircle && drawCircleCounter > 1) {
        // translate in case when we have clicked something else
        ctx.translate(circleTranslateX, circleTranslateY);

        // rotate in case we have clicked the circle and want to change position
        rotate(circleRotate);

        //scale
        ctx.scale(circleScaleX, circleScaleY);

        // create Circle
        createCircle();
        ctx.translate(-(circleTranslateX), -(circleTranslateY));
    }
    else if (drawCircleCounter == 1) {
        drawCircleCounter++;
        createCircle();
    }
}

function createCircle() {
    ctx.beginPath();
    ctx.arc(circleX, circleY, 50, 0, Math.PI * 2, true);
    ctx.stroke();
}

/**
 * draw rectangle
 */
function rectangle() {
    if (drawRectangle && drawRectangleCounter != 1) {
        // translate in case we have clicked the circle and want to change position
        recTranslateX = document.getElementById('translateX').value;
        recTranslateY = document.getElementById('translateY').value;
        ctx.translate(recTranslateX, recTranslateY);

        // rotate in case we have clicked the circle and want to change position
        recRotate = document.getElementById('rotateS').value;
        rotate(recRotate);

        //scale
        recScaleX = document.getElementById('scaleX').value;
        recScaleY = document.getElementById('scaleY').value;
        ctx.scale(recScaleX, recScaleY);

        // create rectangle
        ctx.strokeRect(recX, recY, rectWidth, rectHeight);
        ctx.translate(-(recTranslateX), -(recTranslateY));
    }
    else if ((!drawRectangle && drawRectangleCounter > 1)) {
        // translate in case when we have clicked something else
        ctx.translate(recTranslateX, recTranslateY);

        // rotate in case we have clicked the circle and want to change position
        rotate(recRotate);

        //scale 
        ctx.scale(recScaleX, recScaleY);

        // create rectangle
        ctx.strokeRect(recX, recY, rectWidth, rectHeight);
        ctx.translate(-(recTranslateX), -(recTranslateY));
    }
    else if (drawRectangleCounter == 1) {
        drawRectangleCounter++;
        ctx.strokeRect(recX, recY, rectWidth, rectHeight);
    }
}

/**
 * draw Line
 */
function line() {
    if (drawLine && drawLineCounter != 1) {
        // translate in case we have clicked the circle and want to change position
        lineTranslateX = document.getElementById('translateX').value;
        lineTranslateY = document.getElementById('translateY').value;
        ctx.translate(lineTranslateX, lineTranslateY);
        //scale
        lineScaleX = document.getElementById('scaleX').value;
        lineScaleY = document.getElementById('scaleY').value;
        ctx.scale(lineScaleX, lineScaleX);
        // rotate in case we have clicked the circle and want to change position
        lineRotate = document.getElementById('rotateS').value;
        rotate(lineRotate);
        createLine();
        ctx.translate(-(lineTranslateX), -(lineTranslateY));
    }
    else if ((!drawLine && drawLineCounter > 1)) {
        // translate in case when we have clicked something else
        ctx.translate(lineTranslateX, lineTranslateY);
        //scale
        ctx.scale(lineScaleX, lineScaleX);
        // rotate in case we have clicked the circle and want to change position
        rotate(lineRotate);
        createLine();
        ctx.translate(-(lineTranslateX), -(lineTranslateY));
    }
    else if (drawLineCounter == 1) {
        drawLineCounter++;
        createLine();
    }
}

function createLine() {
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(125, 125);
    ctx.stroke();
}

/**
 *  draw Triangle
 */
function triangle() {
    if (drawTriangle && drawTriangleCounter != 1) {
        // translate in case we have clicked the circle and want to change position
        triangleTranslateX = document.getElementById('translateX').value;
        triangleTranslateY = document.getElementById('translateY').value;
        ctx.translate(triangleTranslateX, triangleTranslateY);
        //scale
        triangleScaleX = document.getElementById('scaleX').value;
        triangleScaleY = document.getElementById('scaleY').value;
        ctx.scale(triangleScaleX, triangleScaleY);
        // rotate in case we have clicked the circle and want to change position
        triangleRotate = document.getElementById('rotateS').value;
        rotate(triangleRotate);
        createTriangle();
        ctx.translate(-(triangleTranslateX), -(triangleTranslateY));
    }
    else if ((!drawTriangle && drawTriangleCounter > 1)) {
        // translate in case when we have clicked something else
        ctx.translate(triangleTranslateX, triangleTranslateY);
        ctx.scale(triangleScaleX, triangleScaleY);
        rotate(triangleRotate);
        createTriangle();
        ctx.translate(-(triangleTranslateX), -(triangleTranslateY));
    }
    else if (drawTriangleCounter == 1) {
        drawTriangleCounter++;
        createTriangle();
        ctx.stroke();
    }
}

/**
 * draw polygon
 */
function polygon() {
    if (drawPolygon && drawPolygonCounter != 1) {
        // translate in case we have clicked the circle and want to change position
        polygonTranslateX = document.getElementById('translateX').value;
        polygonTranslateY = document.getElementById('translateY').value;
        ctx.translate(polygonTranslateX, polygonTranslateY);

        // rotate in case we have clicked the circle and want to change position
        polygonRotate = document.getElementById('rotateS').value;
        rotate(polygonRotate);

        //scale
        polygonScaleX = document.getElementById('scaleX').value;
        polygonScaleY = document.getElementById('scaleY').value;
        ctx.scale(polygonScaleX, polygonScaleY);

        // create polygon
        createPolygon();
        ctx.translate(-(polygonTranslateX), -(polygonTranslateY));
    }
    else if ((!drawPolygon && drawPolygonCounter > 1)) {
        // translate in case when we have clicked something else
        ctx.translate(polygonTranslateX, polygonTranslateY);

        // rotate in case we have clicked the circle and want to change position
        rotate(polygonRotate);

        //scale 
        ctx.scale(polygonScaleX, polygonScaleY);

        // create polygon
        createPolygon();
        ctx.translate(-(polygonTranslateX), -(polygonTranslateY));
    }
    else if (drawPolygonCounter == 1) {
        drawPolygonCounter++;
        createPolygon();
    }
}

function createPolygon() {
    ctx.beginPath();
    ctx.moveTo(99, 0);
    ctx.lineTo(99, 0);
    ctx.lineTo(198, 50);
    ctx.lineTo(198, 148);
    ctx.lineTo(99, 198);
    ctx.lineTo(99, 198);
    ctx.lineTo(1, 148);
    ctx.lineTo(1,50);
    ctx.closePath();
    ctx.stroke();

}

function createTriangle() {
    ctx.beginPath();
    ctx.moveTo(traingleX, triangleY);
    ctx.lineTo(125, 45);
    ctx.lineTo(45, 125);
    ctx.closePath();
    ctx.stroke();
}

/**
 * roatate method
 */
function rotate(rotate) {
    ctx.rotate(rotate * Math.PI / 180);
}

/**
 * clear the canvas
 */
function clearS() {
    location.reload();
}

function createRectangleB() {
    drawRectangle = true;
    drawCircle = false;
    drawLine = false;
    drawTriangle = false;
    drawPolygon = false;
    drawRectangleCounter++;
    magic();
}

function createTriangleB() {
    drawRectangle = false;
    drawCircle = false;
    drawLine = false;
    drawTriangle = true;
    drawPolygon = false;
    drawTriangleCounter++;
    magic();
}

function createCircleB() {
    drawCircle = true;
    drawCircleCounter++;
    drawRectangle = false;
    drawLine = false;
    drawTriangle = false;
    drawPolygon = false;
    magic();
}

function createLineB() {
    drawRectangle = false;
    drawCircle = false;
    drawLine = true;
    drawTriangle = false;
    drawPolygon = false;
    drawLineCounter++;
    magic();
}

function createPolygonB() {
    drawRectangle = false;
    drawCircle = false;
    drawLine = false;
    drawTriangle = false;
    drawPolygon = true;
    drawPolygonCounter++;
    magic();
}

window.onload = init;