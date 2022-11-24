class Building {
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
        this.#DrawBuilding();
    }

    #DrawBuilding() {
        var baseColor = FeatureApi.HexToColorVector("#B7B7B7");

        Primitive.GenerateCube(baseColor);
        this.#vertexCount += Primitive.cubeVertexCount;
    }

    #CreateMatrices(s, r, t) {
        return {
            s: FeatureApi.scale4(s[0], s[1], s[2]),
            r: rotate(r[0], r[1], r[2], r[3]),
            t: translate(t[0], t[1], t[2]),
        };
    }

    #RenderBuilding(drawCount) {
        var matrices;

        // Yellow Box
        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([20, 20, 20], [0, 0, 1, 0], [0, 10, 0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        drawCount = Primitive.DrawCube(drawCount);
        modelViewMatrix = modelViewStack.pop();
        
        return drawCount;
    }

    Render(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1,1,1],[0,0,1,0],[0,0,0]);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        this.#RenderBuilding(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }
}