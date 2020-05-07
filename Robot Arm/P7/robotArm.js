"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

// RGBA colors
var vertexColors = [
    vec4(1.0, 1.0, 1.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 0.0, 0.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 1.0;
var BASE_WIDTH = 5.0;
var LOWER_ARM_HEIGHT = 4.0;
var LOWER_ARM_WIDTH = 0.5;
var UPPER_ARM_HEIGHT = 2.0;
var UPPER_ARM_WIDTH = 0.5;
var FINGER1_HEIGHT = 1.2;
var FINGER1_WIDTH = 0.2;
var FINGER2_HEIGHT = 0.7;
var FINGER2_WIDTH = 0.2;
var FINGER3_HEIGHT = 0.7;
var FINGER3_WIDTH = 0.2;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;
var Finger1 = 3;
var Finger2 = 4;
var Finger3 = 5;

var theta = [0, 0, 0, 0, 0, 0];
var beta = [0, 0, 0, 0, 0, 0];
var zeta = [0, 0, 0, 0, 0, 0];
var Y = [1, 0, 0];
var X = [0, 1, 0];
var Z = [0, 0, 1];
var angle = 0;

var result = mat4();
result[0][3] = 0;
result[1][3] = 0;
result[2][3] = 0;

var result2 = mat4();
result2[0][3] = 0;
result2[1][3] = 0;
result2[2][3] = 0;
var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(a, b, c, d) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}


//--------------------------------------------------


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "attribute  vec4 vPosition;\
    attribute  vec4 vColor;\
    varying vec4 fColor;\
    uniform mat4 modelViewMatrix;\
    uniform mat4 projectionMatrix;\
    void main()\
    {\
        fColor = vColor;\
        gl_Position = projectionMatrix * modelViewMatrix * vPosition;\
    }", "precision mediump float;\
    varying  vec4 fColor;\
    void main()\
    {\
        gl_FragColor = fColor;\
    }" );

    gl.useProgram(program);

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders(gl, "attribute  vec4 vPosition;\
    attribute  vec4 vColor;\
    varying vec4 fColor;\
    uniform mat4 modelViewMatrix;\
    uniform mat4 projectionMatrix;\
    void main()\
    {\
        fColor = vColor;\
        gl_Position = projectionMatrix * modelViewMatrix * vPosition;\
    }", "precision mediump float;\
    varying  vec4 fColor;\
    void main()\
    {\
        gl_FragColor = fColor;\
    }" );
    gl.useProgram(program);

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    // body
    document.getElementById("Xslider1").onchange = function (event) {
        theta[0] = event.target.value;
    };
    document.getElementById("Yslider1").onchange = function (event) {
        beta[0] = event.target.value;
    };
    document.getElementById("Zslider1").onchange = function (event) {
        zeta[0] = event.target.value;
    };
    // lower
    document.getElementById("Xslider2").onchange = function (event) {
        theta[1] = event.target.value;
    };
    document.getElementById("Yslider2").onchange = function (event) {
        beta[1] = event.target.value;
    };
    document.getElementById("Zslider2").onchange = function (event) {
        zeta[1] = event.target.value;
    };
    // upper
    document.getElementById("Xslider3").onchange = function (event) {
        theta[2] = event.target.value;
    };
    document.getElementById("Yslider3").onchange = function (event) {
        beta[2] = event.target.value;
    };
    document.getElementById("Zslider3").onchange = function (event) {
        zeta[2] = event.target.value;
    };
    // finger1
    document.getElementById("Xslider4").onchange = function (event) {
        theta[3] = event.target.value;
    };
    document.getElementById("Yslider4").onchange = function (event) {
        beta[3] = event.target.value;
    };
    document.getElementById("Zslider4").onchange = function (event) {
        zeta[3] = event.target.value;
    };
    // finger2
    document.getElementById("Xslider5").onchange = function (event) {
        theta[4] = event.target.value;
    };
    document.getElementById("Yslider5").onchange = function (event) {
        beta[4] = event.target.value;
    };
    document.getElementById("Zslider5").onchange = function (event) {
        zeta[4] = event.target.value;
    };
    // finger3
    document.getElementById("Xslider6").onchange = function (event) {
        theta[5] = event.target.value;
    };
    document.getElementById("Yslider6").onchange = function (event) {
        beta[5] = event.target.value;
    };
    document.getElementById("Zslider6").onchange = function (event) {
        zeta[5] = event.target.value;
    };

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    render();
}

//----------------------------------------------------------------------------


function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * BASE_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function lowerArm() {
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

function finger1() {
    var s = scale4(FINGER1_WIDTH, FINGER1_HEIGHT, FINGER1_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.7* FINGER1_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}


//----------------------------------------------------------------------------

function finger2() {
    var s = scale4(FINGER2_WIDTH, FINGER2_HEIGHT, FINGER2_WIDTH);
    var t = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}


//----------------------------------------------------------------------------
function finger3() {
    var s = scale4(FINGER3_WIDTH, FINGER3_HEIGHT, FINGER3_WIDTH);
    var t = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}


//----------------------------------------------------------------------------

var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = rotate(theta[Base],X );
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[Base], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[Base], Z));
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm],X));
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[LowerArm], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[LowerArm], Z));
    lowerArm();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm], X));
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[UpperArm], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[UpperArm],Z));
    upperArm();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, FINGER1_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[Finger1], X));
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[Finger1], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[Finger1],Z));
    finger1();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, FINGER2_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[Finger2], X));
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[Finger2], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[Finger2],Z));
    finger2();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, FINGER3_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[Finger3], X));
    modelViewMatrix = mult(modelViewMatrix, rotate(beta[Finger3], Y));
    modelViewMatrix = mult(modelViewMatrix, rotate(zeta[Finger3],Z));
    finger3();
    requestAnimFrame(render);
}
