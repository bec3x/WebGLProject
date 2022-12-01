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
        this.#DrawWalls();
        this.#DrawRoof();
    }

    #DrawWalls() {
        var baseColor = FeatureApi.HexToColorVector("#B7B7B7");
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
    
        FeatureApi.Quad(vertices[1], vertices[0], vertices[3], vertices[2], baseColor);
        FeatureApi.Quad(vertices[2], vertices[3], vertices[7], vertices[6], baseColor);
        FeatureApi.Quad(vertices[6], vertices[7], vertices[4], vertices[5], baseColor);
        FeatureApi.Quad(vertices[5], vertices[4], vertices[0], vertices[1], baseColor);

        this.#vertexCount += 24;
    }

    #DrawRoof() {
        var baseColor = FeatureApi.HexToColorVector("#B7B7B7");
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


        FeatureApi.Quad(vertices[6], vertices[5], vertices[1], vertices[2], baseColor);

        this.#vertexCount += 6;
    }

    #CreateMatrices(s, r, t) {
        return {
            s: FeatureApi.scale4(s[0], s[1], s[2]),
            r: rotate(r[0], r[1], r[2], r[3]),
            t: translate(t[0], t[1], t[2]),
        };
    }

    #RenderWalls(drawCount) {
        var matrices;


        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([20, 20, 20], [0, 0, 1, 0], [0, 10, 0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        // Draw Textured Side walls
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
        gl.drawArrays(gl.TRIANGLES, drawCount, 24);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);

        modelViewMatrix = modelViewStack.pop();
    }

    #RenderRoof(drawCount) {
        var matrices;


        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([20, 20, 20], [0, 0, 1, 0], [0, 10, 0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, this.#translationMatrix), matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        // Draw Textured Side walls
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
        gl.drawArrays(gl.TRIANGLES, drawCount + this.#vertexCount - 6, 6);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);

        modelViewMatrix = modelViewStack.pop();
    }

    Render(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1,1,1],[0,0,1,0],[0,0,0]);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        this.#RenderWalls(drawCount);
        this.#RenderRoof(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }
}