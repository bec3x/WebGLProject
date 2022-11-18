var TrafficLight = {
    numVertTrafficLight: 0,

    //Generate Traffic Light
    DrawTrafficLight: function () {
        var s,r,t;

        //Yellow Box
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1/2,1,1/2);
        r = rotate(90,0,1,0);
        t = translate(0,4.5,3);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawCube(0);
        this.numVertTrafficLight += Primitive.numVertCube;
        modelViewMatrix = modelViewStack.pop();

        //Red light
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1,1,1);
        r = rotate(90,0,1,0);
        t = translate(-0.25,4.8,3);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawSphere(0,0.125);
        this.numVertTrafficLight += Primitive.sphereCount;
        modelViewMatrix = modelViewStack.pop();

        //Green light
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1,1,1);
        r = rotate(90,0,1,0);
        t = translate(-0.25,4.5,3);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawSphere(1,0.125);
        this.numVertTrafficLight += Primitive.sphereCount;
        modelViewMatrix = modelViewStack.pop();

        //Yellow light
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1,1,1);
        r = rotate(90,0,1,0);
        t = translate(-0.25,4.2,3);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawSphere(2,0.125);
        this.numVertTrafficLight += Primitive.sphereCount;
        modelViewMatrix = modelViewStack.pop();
    },

    //Generate light pole
    DrawTrafficPole: function () {
        var s,r,t;

        //First Pole
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1/8,3,1/8);
        r = rotate(0,0,1,0);
        t = translate(0,0,0);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawCylinder(0);
        this.numVertTrafficLight += Primitive.numVertCylinder;
        modelViewMatrix = modelViewStack.pop();

        //Second Pole
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1/8,2,1/8);
        r = rotate(90,1,0,0);
        t = translate(0,5.5,0);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawCylinder(0);
        this.numVertTrafficLight += Primitive.numVertCylinder;
        modelViewMatrix = modelViewStack.pop();

        //Third Pole
        modelViewStack.push(modelViewMatrix);
        s = FeatureApi.scale4(1/8,1/3,1/8);
        r = rotate(0,0,1,0);
        t = translate(0,4.75,3);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        Primitive.DrawCylinder(0);
        this.numVertTrafficLight += Primitive.numVertCylinder;
        modelViewMatrix = modelViewStack.pop();
    },



    //Render
    RenderTrafficLight: function () {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, rotate(90,0,1,0));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        this.DrawTrafficLight();
        this.DrawTrafficPole();

        modelViewMatrix = modelViewStack.pop();
    }
};
