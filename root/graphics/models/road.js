class Road {
    #vertexCount;
    #height;

    constructor() {
        this.#vertexCount = 0;
        this.#height = -0.1;
    }

    get VertexCount() {
        return this.#vertexCount;
    }

    Generate() {
        this.#DrawGrass(); 

        this.#DrawRoad();
    }

    #DrawGrass() {
        var baseColor = FeatureApi.HexToColorVector("#265D07");
        var a,b,c,d;
        var width = 32;

        //Bottom left patch
        a = vec4(-1 * width,this.#height,width);
        b = vec4(-1 * width,this.#height,4);
        c = vec4(-4,this.#height,4);
        d = vec4(-4,this.#height,width);

        FeatureApi.Quad(a,b,c,d,baseColor);
        this.#vertexCount += 6;

        //Top left patch
        a = vec4(-1 * width,this.#height,-1 *width);
        b = vec4(-1 * width,this.#height,-4);
        c = vec4(-4,this.#height,-4);
        d = vec4(-4,this.#height,-1 * width);

        FeatureApi.Quad(a,b,c,d,baseColor);
        this.#vertexCount += 6;

        //Top right patch
        a = vec4(width,this.#height,-1 *width);
        b = vec4(width,this.#height,-4);
        c = vec4(4,this.#height,-4);
        d = vec4(4,this.#height,-1 * width);

        FeatureApi.Quad(a,b,c,d,baseColor);
        this.#vertexCount += 6;

        //Bottom right patch
        a = vec4(width,this.#height,width);
        b = vec4(width,this.#height,4);
        c = vec4(4,this.#height,4);
        d = vec4(4,this.#height,width);

        FeatureApi.Quad(a,b,c,d,baseColor);
        this.#vertexCount += 6;
    }

    #DrawRoad() {
        var roadColor = FeatureApi.HexToColorVector("#000000");
        var a,b,c,d;

        a = vec4(-32,this.#height + 0.01,4);
        b = vec4(-32,this.#height + 0.01,-4);
        c = vec4(32,this.#height + 0.01,-4);
        d = vec4(32,this.#height + 0.01,4);

        FeatureApi.Quad(d,a,b,c,roadColor);
        this.#vertexCount += 6;

        a = vec4(-4,this.#height + 0.016,32);
        b = vec4(-4,this.#height + 0.016,-32);
        c = vec4(4,this.#height + 0.016,-32);
        d = vec4(4,this.#height + 0.016,32);

        FeatureApi.Quad(a,b,c,d,roadColor);
        this.#vertexCount += 6;
    }

    Render(drawCount) {
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        // Draw textured grass
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
        gl.drawArrays(gl.TRIANGLES, drawCount, 24);

        // Draw textured roads
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);
        gl.drawArrays(gl.TRIANGLES, drawCount + 24, this.#vertexCount - 24);

        gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);
    }
}