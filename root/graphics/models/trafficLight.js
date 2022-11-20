class TrafficLight {
    #vertexCount;
    #translationMatrix;

    constructor(translationMatrix = mat4()) {
        this.#vertexCount = 0;
        this.#translationMatrix = translationMatrix;
    }

    get VertexCount() {
        return this.#vertexCount;
    }

    Generate() {
        this.#DrawTrafficLight();
        this.#DrawTrafficPole();
    }

    #DrawTrafficLight() {
        var baseColor = FeatureApi.HexToColorVector("#666666");
        var redColor = FeatureApi.HexToColorVector("#FF0000");
        var yellowColor = FeatureApi.HexToColorVector("#FFFF00");
        var greenColor = FeatureApi.HexToColorVector("#00FF00");

        Primitive.GenerateCube(baseColor);
        this.#vertexCount += Primitive.cubeVertexCount;

        Primitive.GenerateSphere(redColor);
        this.#vertexCount += Primitive.sphereVertexCount;

        Primitive.GenerateSphere(yellowColor);
        this.#vertexCount += Primitive.sphereVertexCount;

        Primitive.GenerateSphere(greenColor);
        this.#vertexCount += Primitive.sphereVertexCount;
    }

    #DrawTrafficPole() {
        var poleColor = FeatureApi.HexToColorVector("#B3B3B3");

        for (var i = 0; i < 3; i++) {
            Primitive.GenerateCylinder(poleColor);
            this.#vertexCount += Primitive.cylinderVertexCount;
        }
    }

    #CreateMatrices(s, r, t) {
        return {
            s: FeatureApi.scale4(s[0], s[1], s[2]),
            r: rotate(r[0], r[1], r[2], r[3]),
            t: translate(t[0], t[1], t[2]),
        };
    }

    #RenderLights(drawCount) {
        var matrices;

        // Yellow Box
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/2, 1, 1/2], [90, 0, 1, 0], [0, 4.5, 3]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCube(drawCount);
        modelViewMatrix = modelViewStack.pop();

        // Red Light
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([.125, .125, .125], [90,0,1,0], [-0.25,4.8,3]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawSphere(drawCount);
        modelViewMatrix = modelViewStack.pop();

        // Yellow Light
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([.125, .125, .125], [90,0,1,0], [-0.25,4.5,3]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawSphere(drawCount);
        modelViewMatrix = modelViewStack.pop();

        // Green Light
        modelViewStack.push(modelViewMatrix); 
        matrices = this.#CreateMatrices([.125, .125, .125], [90,0,1,0], [-0.25,4.2,3]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawSphere(drawCount);
        modelViewMatrix = modelViewStack.pop(); 
        
        return drawCount;
    }

    #RenderTrafficPole(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/8,3,1/8], [0,0,1,0], [0,0,0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCylinder(drawCount);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/8,2,1/8], [90,1,0,0], [0,5.5,0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCylinder(drawCount);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/8,1/3,1/8], [0,0,1,0], [0,4.75,3]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCylinder(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }

    Render(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1,1,1],[0,0,1,0],[0,0,0]);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = this.#RenderLights(drawCount);
        this.#RenderTrafficPole(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }
}