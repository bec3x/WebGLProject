/*  
    Intention of this program is to be used as a general program to populate models
    that we draw so that we do not have to recreate the same thing over and over
*/
var canvas, program, gl;

var eye = [1, .5, 1];
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

var lightPosition = vec4(0, -5, 4, 0.0);
var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0);
var lightDiffuse = vec4(0,0,0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.1, 0.1, 0.1, 1.0);
var materialDiffuse = vec4(1, 1, 1, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 50.0;

// #endregion

var models = [];
var car;

//#region Main
window.onload = function init() {
    ConfigureWebGL();

    MouseManipulation.init('gl-canvas');

    var height = 0;

    // Creating list of models
    models = [
        // Main Road
        new Road(),
        // Bus Stop
        new BusStop(translate(10, height, -5)),
        // Left Road Side for Street Lights
        new StreetLight(mult(translate(-12, height, -4.5), rotate(0, 0, 1, 0))),
        new StreetLight(mult(translate(-24, height, -4.5), rotate(0, 0, 1, 0))),
        new StreetLight(mult(translate(-12, height, 4.5), rotate(180, 0, 1, 0))),
        new StreetLight(mult(translate(-24, height, 4.5), rotate(180, 0, 1, 0))),
        // Right Road Side for Street Lights
        new StreetLight(mult(translate(14, height, -4.5), rotate(0, 0, 1, 0))),
        new StreetLight(mult(translate(26, height, -4.5), rotate(0, 0, 1, 0))),
        new StreetLight(mult(translate(14, height, 4.5), rotate(180, 0, 1, 0))),
        new StreetLight(mult(translate(26, height, 4.5), rotate(180, 0, 1, 0))),
        // Bottom Road Side for Street Lights
        new StreetLight(mult(translate(-4.5, height, 12), rotate(90, 0, 1, 0))),
        new StreetLight(mult(translate(-4.5, height, 24), rotate(90, 0, 1, 0))),
        new StreetLight(mult(translate(4.5, height, 12), rotate(270, 0, 1, 0))),
        new StreetLight(mult(translate(4.5, height, 24), rotate(270, 0, 1, 0))),
        // Top Road Side for Traffic Cones
        new TrafficCone(translate(3.5, height + 0.1, -4.5)),
        new TrafficCone(translate(1.5, height + 0.1, -4.5)),
        new TrafficCone(translate(-1.5, height + 0.1, -4.5)),
        new TrafficCone(translate(-3.5, height + 0.1, -4.5)),
        // Car
        new Car(translate(-25, height + 1, 2)),
        // Stop Sign
        new StopSign(translate(4.5, height, 7)),
        // Traffic Lights on each corner of the Road
        new TrafficLight(mult(translate(-4.5, height, -4.5), rotate(0, 0, 1, 0))),
        new TrafficLight(mult(translate(4.5, height, 4.5), rotate(180, 0, 1, 0))),
        // Trash Can
        //new TrashCan(FeatureApi.scale4(1,1,1)),
    ];

    car = GetCarModel();
    // Idea: After all points have been generated.. pass the models to the car, so that collision can be detected?
    // Generate the points for each model
    models.forEach((model) => {
        model.Generate();
    });

    RegisterEvents();

    InitBuffers();
    Render();
}
//#endregion

//#region General Functions
const GetCarModel = () => {
    var carModels = models.filter((model) => {
        return model instanceof Car;
    });

    if (carModels.length == 0) {
        return;
    }

    return carModels[0]; // assumes the first car is the car that will be animated
}

const RegisterEvents = () => {
    document.addEventListener('keydown', function (event) {
        if (event.name === 'Shift') {
            return;
        }

        if (event.code === 'KeyA' || (event.shiftKey && event.code === 'KeyA')) {
            if (car == null) return;
            car.CarAnimated = !car.CarAnimated;
        }
    });
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

    projectionMatrix = ortho(-32, 32, -32, 32, -100, 100);
    // projectionMatrix = ortho(-8, 8, -8, 8, -8, 8);

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

    // Render each model
    models.forEach((model) => {
        modelViewStack.push(modelViewMatrix);
        model.Render(drawCount);
        drawCount += model.VertexCount;
        modelViewMatrix = modelViewStack.pop();
    });

    requestAnimationFrame(Render);
}


//#endregion