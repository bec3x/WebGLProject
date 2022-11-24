class SpeedLimit {
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
        this.#GeneratePole();
        this.#GenerateSign();
    }

    #GeneratePole() {
        var poleColor = FeatureApi.HexToColorVector("#B7B7B7");
        var SIZE=100; // slices
        var center = [0,0,0];
        var radius = 0.05;
        var angle = 2*Math.PI/SIZE;
        var a,b,c,d;
        var height = 2.25;
    
        for (var i = 0; i < SIZE; i++) {
            //Top circle
            a = vec4(center[0]+radius*Math.cos(i*angle), height, center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), height,center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], height, center[1]);
            FeatureApi.Triangle(a, b, c, poleColor);
    
            //Bottom circle
            a = vec4(center[0]+radius*Math.cos(i*angle), center[1], center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), center[1],center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], center[1], center[1]);
            FeatureApi.Triangle(c, b, a, poleColor);
    
            //Cylinder
            a = vec4(radius * Math.cos(i * angle), height, radius * Math.sin(i * angle));
            b = vec4(radius * Math.cos(i * angle), 0, radius * Math.sin(i * angle));
            c = vec4(radius * Math.cos((i + 1) * angle), 0, radius * Math.sin((i + 1) * angle));
            d = vec4(radius * Math.cos((i + 1) * angle), height, radius * Math.sin((i + 1) * angle));
            FeatureApi.Quad(a, b, c, d, poleColor);
            this.#vertexCount += 12;
        }
    }

    #GenerateSign() {
        var signFrontFaceColor = FeatureApi.HexToColorVector("#FF0000");
        var signBackFaceColor = FeatureApi.HexToColorVector("#B2B2B2");
        var blackColor = FeatureApi.HexToColorVector("#000000");
        var radius = 0.45;
        var height = .65;
        var center = [0,2,0.07];
        var fa,fb,fc,fd, ba,bb,bc,bd;
        var sideLenghth = 0.02;
    
        //Front Face
        fa = vec4(center[0] + radius, center[1] + height, center[2]);
        fb = vec4(center[0] - radius, center[1] + height, center[2]);
        fc = vec4(center[0] - radius, center[1] - height, center[2]);
        fd = vec4(center[0] + radius, center[1] - height, center[2]);
        FeatureApi.Quad(fa,fb,fc,fd, signFrontFaceColor);
        this.#vertexCount += 6;

        //Back Face
        ba = vec4(center[0] + radius, center[1] + height, center[2] - sideLenghth);
        bb = vec4(center[0] - radius, center[1] + height, center[2] - sideLenghth);
        bc = vec4(center[0] - radius, center[1] - height, center[2] - sideLenghth);
        bd = vec4(center[0] + radius, center[1] - height, center[2] - sideLenghth);
        FeatureApi.Quad(ba,bd,bc,bb, signBackFaceColor);
        this.#vertexCount += 6;

        //Around the sign
        FeatureApi.Quad(fa,fb,bb,ba, blackColor);
        FeatureApi.Quad(fb,fc,bc,bb, blackColor);
        FeatureApi.Quad(fc,fd,bd,bc, blackColor);
        FeatureApi.Quad(fd,fa,ba,bd, blackColor);
        this.#vertexCount += 6 * 4;
    }

    Render(drawCount) {
        modelViewMatrix = mult(modelViewMatrix, this.#translationMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, drawCount, this.#vertexCount);
    }
}