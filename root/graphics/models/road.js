class Road {
    #vertexCount;
    #height;

    constructor() {
        this.#vertexCount = 0;
        this.#height = -16;
    }

    get VertexCount() {
        return this.#vertexCount;
    }

    Generate() {
        this.#DrawRoad();
        this.#DrawSidewalk();
    }

    #DrawSidewalk() {
        var baseColor = FeatureApi.HexToColorVector("#D8D8D8");
        var a,b,c,d;
        var width = 32;

        a = vec4(-1 * width,this.#height,width);
        b = vec4(-1 * width,this.#height,-1 * width);
        c = vec4(width,this.#height,-1 * width);
        d = vec4(width,this.#height,width);

        FeatureApi.Quad(a,b,c,d,baseColor);
        this.#vertexCount += 6;
    }

    #DrawRoad() {
        var roadColor = FeatureApi.HexToColorVector("#000000");
        var yellowColor = FeatureApi.HexToColorVector("#f7b500");
        var a,b,c,d;

        a = vec4(-32,this.#height + 0.01,4);
        b = vec4(-32,this.#height + 0.01,-4);
        c = vec4(32,this.#height + 0.01,-4);
        d = vec4(32,this.#height + 0.01,4);

        FeatureApi.Quad(a,b,c,d,roadColor);
        this.#vertexCount += 6;

        a = vec4(-4,this.#height + 0.01,32);
        b = vec4(-4,this.#height + 0.01,-32);
        c = vec4(4,this.#height + 0.01,-32);
        d = vec4(4,this.#height + 0.01,32);

        FeatureApi.Quad(a,b,c,d,roadColor);
        this.#vertexCount += 6;
    }

    Render(drawCount) {
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, drawCount, this.#vertexCount);
    }
}