/*  
    Intention of this program is to be used as a general program to populate models
    that we draw so that we do not have to recreate the same thing over and over
*/
var canvas, program, gl;

var eye = [1, 0.5, 1];
var at = [0, 0, 0];
var up = [0, 1, 0];

// #region Matrix Structures
var points = [];
var colors = [];
var normals = [];

var modelViewStack = [];
var modelViewMatrix = mat4(), 
    projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var t1, t2;
var car, car2;
// #endregion

//#region Main
window.onload = function init() {
    ConfigureWebGL();

    MouseManipulation.init('gl-canvas');

    car = new Car(translate(-2, 0, 0));
    car2 = new Car(translate(-2, 5, 0));

    t1 = new TrafficCone(translate(1, 0, 0));
    t2 = new TrafficCone(translate(-1, 0, 3));
    
    car.GenerateCar();
    car2.GenerateCar();

    t1.GenerateTrafficCone();
    t2.GenerateTrafficCone();

    InitBuffers();
    Render();
}
//#endregion

//#region WebGL Functions
const ConfigureWebGL = () => {
    canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('WebGL is not available');
    }

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);
}

const InitBuffers = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);

    viewerPos = vec3(4.0, 4.0, 4.0);
    projectionMatrix = ortho(-8, 8, -8, 8, -20, 20);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

const Render = () => {
    var drawCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(projectMatrixLoc, false, flatten(projectionMatrix));

    eye = vec3(MouseManipulation.radius * Math.cos(MouseManipulation.phi),
        MouseManipulation.radius * Math.sin(MouseManipulation.theta),
        MouseManipulation.radius * Math.sin(MouseManipulation.phi));

    modelViewMatrix = lookAt(eye, at, up);
    modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    car.RenderCar(drawCount);
    drawCount += car.VertexCount;

    modelViewMatrix = modelViewStack[0];
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    car2.RenderCar(drawCount);
    drawCount += car2.VertexCount;

    modelViewMatrix = modelViewStack[0];
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    t1.RenderTrafficCone(drawCount);
    drawCount += t1.VertexCount;

    modelViewMatrix = modelViewStack[0];
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    t2.RenderTrafficCone(drawCount);
    drawCount += t2.VertexCount;
    modelViewMatrix = modelViewStack.pop();
}
//#endregion