class StreetLight {
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
        this.#DrawStreetLight();
        this.#DrawStreetPole();
    }

    #DrawStreetLight() {
        var baseColor = FeatureApi.HexToColorVector("#666666");
        var yellowWhiteColor = FeatureApi.HexToColorVector("#f7e98e");

        Primitive.GenerateCone(baseColor);
        this.#vertexCount += Primitive.coneVertexCount;

        Primitive.GenerateSphere(yellowWhiteColor);
        this.#vertexCount += Primitive.sphereVertexCount;
    }

    #DrawStreetPole() {
        var poleColor = FeatureApi.HexToColorVector("#B3B3B3");

        for (var i = 0; i < 2; i++) {
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

        // Cone
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/2.5, 1/2.5, 1/2.5], [90, 0, 1, 0], [0, 5.2, 1.75]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCone(drawCount);
        modelViewMatrix = modelViewStack.pop();

        // Light
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([.25, .25, .25], [90,0,1,0], [0,5.1,1.75]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawSphere(drawCount);
        modelViewMatrix = modelViewStack.pop();
        
        return drawCount;
    }

    #RenderStreetPole(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/8,3,1/8], [0,0,1,0], [0,0,0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCylinder(drawCount);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1/8,1,1/8], [90,1,0,0], [0,5.5,0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCylinder(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }

    Render(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1,1,1],[90,0,1,0],[0,0,0]);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = this.#RenderLights(drawCount);
        this.#RenderStreetPole(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }
}