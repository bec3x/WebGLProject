/*  
    Intention of this program is to be used as a general program to populate models
    that we draw so that we do not have to recreate the same thing over and over
*/

var gl, program, canvas;
var drawCount = 0;

// #region Matrix Structures
var points = [];
var colors = [];

var modelViewStack = [];
var modelViewMatrix = mat4(), 
    projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
// #endregion

//#region Main
window.onload = function init() {
    ConfigureWebGL();
    
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    InitBuffers();
    Render(GenerateCar);
}
//#endregion

//#region WebGL Functions
const ConfigureWebGL = () => {
    canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) { alert('WebGL context failed'); }
}

const InitBuffers = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 1, 1);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

const Render = (drawFunction) => {
    if (drawFunction == null) return;
    
    drawCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    drawFunction();
}
//#endregion

//#region Render Functions

/* 
    These functions should be able to be extracted into their own files so that we can 
    reference them from other locations.
*/
const GenerateCar = () => {

}

const RenderCar = () => {

}
//#endregion