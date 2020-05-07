"use strict";

var gl;
var points;
var delay = 400;
var NumPoints = 5000;
var scaleCount = 0.52;
var reachedMax = false;
var colorMix = 0.28;
window.onload = function init() {
    createTriangle();
};


function createTriangle() {
    // create canvas
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // set variables
    setColorAndScaling();

    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices
    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v));

    // And, add our initial point into our array of points
    points = [p];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex
    for (var i = 0; points.length < NumPoints; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = add(points[i], vertices[j]);
        p = scale(scaleCount, p);
        points.push(p);
    }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "attribute vec4 vPosition;\
    void main(){ \
        gl_PointSize = 1.0;\
        gl_Position = vPosition;\
    }",
        "precision mediump float;\
    void main(){\
        float u_time;\
        vec3 colorA = vec3(0.149,0.141,0.912);\
        vec3 colorB = vec3(1.000,0.833,0.224);\
        vec3 color = vec3(0.0);\
        float pct = abs(sin(u_time));\
        color = mix(colorA, colorB,"+ colorMix + ");\
        gl_FragColor = vec4( color, 1.0 );\}");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();

    /**
     * This method sets the scaling and color for the triangle 
     */
    function setColorAndScaling() {
        if (scaleCount < 0.34) {
            reachedMax = true;
        }
        else if (scaleCount > 0.47) {
            reachedMax = false;
        }
        if (reachedMax == false) {
            scaleCount = scaleCount - 0.01;
        }
        else {
            scaleCount = scaleCount + 0.01;
        }
        if (colorMix > 0.48) {
            colorMix = colorMix - 0.6;
        }
        else {
            colorMix = colorMix + 0.6;
        }
        if (NumPoints <= 500) {
            NumPoints = 5000;
        } else {
            NumPoints = NumPoints - 250;
        }
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
    // animate the createTriangle function
    setTimeout(
        function () { requestAnimFrame(createTriangle); }, delay
    );
}
