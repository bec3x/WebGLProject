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
var ambientProduct, diffuseProduct, specularProduct;

var lightPosition = vec4(0, 0, 0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.5, 0.5, 1.0);
var materialDiffuse = vec4(1.0, 0.1, 0.1, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 50.0;

var vertexCount = 0;

// #endregion

var models = [];

//#region Main
window.onload = function init() {
    ConfigureWebGL();

    MouseManipulation.init('gl-canvas');

    models = [
        new BusStop(),
        new StreetLight(translate(-4, 0, -2)),
        new TrafficCone(translate(-2, 0, -2)),
        new Car(translate(4, 0, 2)),
        new StopSign(translate(4, 0, 1)),
        new TrafficLight(translate(0, 0, 4)),
    ];

    models.forEach((model) => {
        model.Generate();
        vertexCount += model.VertexCount;
    })

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

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"), materialShininess);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

const Render = () => {
    var drawCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    eye = vec3(MouseManipulation.radius * Math.cos(MouseManipulation.phi),
        MouseManipulation.radius * Math.sin(MouseManipulation.theta),
        MouseManipulation.radius * Math.sin(MouseManipulation.phi));

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    models.forEach((model) => {
        modelViewStack.push(modelViewMatrix);
        model.Render(drawCount);
        drawCount += model.VertexCount;
        modelViewMatrix = modelViewStack.pop();
    });

    // modelViewStack.push(modelViewMatrix);
    // busStop.Render(drawCount);
    // drawCount += busStop.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

    // modelViewStack.push(modelViewMatrix);
    // streetLight.Render(drawCount);
    // drawCount += streetLight.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

    // modelViewStack.push(modelViewMatrix);
    // cone.Render(drawCount);
    // drawCount += cone.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

    // modelViewStack.push(modelViewMatrix);
    // car.Render(drawCount);
    // drawCount += car.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

    // modelViewStack.push(modelViewMatrix);
    // stopSign.Render(drawCount);
    // drawCount += stopSign.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

    // modelViewStack.push(modelViewMatrix);
    // trafficLight.Render(drawCount);
    // drawCount += trafficLight.VertexCount;
    // modelViewMatrix = modelViewStack.pop();

}
//#endregion