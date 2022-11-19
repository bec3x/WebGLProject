class StopSign {
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
        this.#GenerateStopSignPole();
        this.#GenerateSign();
    }

    #GenerateStopSignPole() {
        var poleColor = FeatureApi.HexToColorVector("#B7B7B7");
        var SIZE=100; // slices
        var center = [0,0,0];
        var radius = 0.05;
        var angle = 2*Math.PI/SIZE;
        var a,b,c,d;
        var height = 2.5;
    
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
        var borderColor = FeatureApi.HexToColorVector("#E6E6E6");
        var slices = 8;
        var radius = 0.75;
        var center = [0,2,0.1];
        var angle = 2 * Math.PI / 8;
        var a,b,c,d;
        var rotateAngle = Math.PI / 8;
        var sideLenghth = 0.02;
    
        for (var i = 0; i < slices; i++){
            //Front Face
            a = vec4(center[0]+radius*Math.cos(i*angle + rotateAngle),center[1]+radius*Math.sin(i*angle + rotateAngle),center[2]);
            b = vec4(center[0]+radius*Math.cos((i+1)*angle + rotateAngle),center[1]+radius*Math.sin((i+1)*angle + rotateAngle),center[2]);
            c = vec4(center[0],center[1],center[2]);
            FeatureApi.Triangle(a,b,c,signFrontFaceColor);
            this.#vertexCount += 3;
    
            //Back Face
            a = vec4(center[0]+radius*Math.cos(i*angle + rotateAngle),center[1]+radius*Math.sin(i*angle + rotateAngle),center[2] - sideLenghth);
            b = vec4(center[0]+radius*Math.cos((i+1)*angle + rotateAngle),center[1]+radius*Math.sin((i+1)*angle + rotateAngle),center[2] - sideLenghth);
            c = vec4(center[0],center[1],center[2] - sideLenghth);
            FeatureApi.Triangle(b,a,c,signBackFaceColor);
            this.#vertexCount += 3;
    
            //Around the sign
            a = vec4(center[0]+radius*Math.cos(i*angle + rotateAngle),center[1]+radius*Math.sin(i*angle + rotateAngle),center[2]);
            b = vec4(center[0]+radius*Math.cos(i*angle + rotateAngle),center[1]+radius*Math.sin(i*angle + rotateAngle),center[2] - sideLenghth);
            c = vec4(center[0]+radius*Math.cos((i+1)*angle + rotateAngle),center[1]+radius*Math.sin((i+1)*angle + rotateAngle),center[2]);
            d = vec4(center[0]+radius*Math.cos((i+1)*angle + rotateAngle),center[1]+radius*Math.sin((i+1)*angle + rotateAngle),center[2] - sideLenghth);
            FeatureApi.Quad(a,b,c,d, blackColor);
            this.#vertexCount += 6;
    
            //White Edge for the sign
            a = vec4(center[0]+radius*Math.cos(i*angle + rotateAngle),center[1]+radius*Math.sin(i*angle + rotateAngle),center[2] + 0.001);
            b = vec4(center[0]+ (radius - 0.05) *Math.cos(i*angle + rotateAngle),center[1]+(radius - 0.05)*Math.sin(i*angle + rotateAngle),center[2] + 0.001);
            c = vec4(center[0]+(radius - 0.05)*Math.cos((i+1)*angle + rotateAngle),center[1]+(radius - 0.05)*Math.sin((i+1)*angle + rotateAngle),center[2] + 0.001);
            d = vec4(center[0]+radius*Math.cos((i+1)*angle + rotateAngle),center[1]+radius*Math.sin((i+1)*angle + rotateAngle),center[2] + 0.001);
            FeatureApi.Quad(a,b,c,d, borderColor);
            this.#vertexCount += 6;
        }
    
        //Letter S
        var sVertices = [vec4(-0.37,2.275,0.101),
                        vec4(-0.37,2.165,0.101),
                        vec4(-0.52,2.165,0.101),
                        vec4(-0.52,2.055,0.101),
                        vec4(-0.37,2.055,0.101),
                        vec4(-0.37,1.725,0.101),
                        vec4(-0.6,1.725,0.101),
                        vec4(-0.60,1.835,0.101),
                        vec4(-0.45,1.835,0.101),
                        vec4(-0.45,1.945,0.101),
                        vec4(-0.6,1.945,0.101),
                        vec4(-0.6,2.275,0.101)];
    
        FeatureApi.Quad(sVertices[2], sVertices[1], sVertices[0], sVertices[11], borderColor);
        FeatureApi.Quad(sVertices[11], sVertices[10], sVertices[3], sVertices[2], borderColor);
        FeatureApi.Quad(sVertices[10], sVertices[9], sVertices[4], sVertices[3], borderColor);
        FeatureApi.Quad(sVertices[9], sVertices[8], sVertices[5], sVertices[4], borderColor);
        FeatureApi.Quad(sVertices[8], sVertices[7], sVertices[6], sVertices[5], borderColor);
        this.#vertexCount += 30;
    
        //Letter T
        var tVertices = [vec4(-0.045,2.275,0.101),
                        vec4(-0.33,2.275,0.101),
                        vec4(-0.33,2.15,0.101),
                        vec4(-0.23,2.15,0.101),
                        vec4(-0.23,1.725,0.101),
                        vec4(-0.125,1.725,0.101),
                        vec4(-0.125,2.15,0.101),
                        vec4(-0.045,2.15,0.101)];
    
        FeatureApi.Quad(tVertices[0], tVertices[1], tVertices[2], tVertices[7], borderColor);
        FeatureApi.Quad(tVertices[3], tVertices[4], tVertices[5], tVertices[6], borderColor);
        this.#vertexCount += 12;
    
        //Letter O
        var oVertices = [vec4(0.33,2.275,0.101),
                        vec4(0.045,2.275,0.101),
                        vec4(0.045,1.725,0.101),
                        vec4(0.33,1.725,0.101),
                        vec4(0.25,2.19,0.101),
                        vec4(0.125,2.19,0.101),
                        vec4(0.125,1.81,0.101),
                        vec4(0.25,1.81,0.101)];
    
        FeatureApi.Quad(oVertices[0], oVertices[1], oVertices[5], oVertices[4], borderColor);
        FeatureApi.Quad(oVertices[5], oVertices[1], oVertices[2], oVertices[6], borderColor);
        FeatureApi.Quad(oVertices[6], oVertices[2], oVertices[3], oVertices[7], borderColor);
        FeatureApi.Quad(oVertices[7], oVertices[3], oVertices[0], oVertices[4], borderColor);
        this.#vertexCount += 24;
    
        //Letter P
        var pVertices = [vec4(0.6,2.275,0.101),
                        vec4(0.6,2,0.101),
                        vec4(0.455,2,0.101),
                        vec4(0.455,1.725,0.101),
                        vec4(0.37,1.725,0.101),
                        vec4(0.37,2.275,0.101),
                        vec4(0.55,2.2,0.101),
                        vec4(0.55,2.1,0.101),
                        vec4(0.455,2.1,0.101),
                        vec4(0.455,2.2,0.101)];
    
        FeatureApi.Quad(pVertices[0], pVertices[5], pVertices[9], pVertices[6], borderColor);
        FeatureApi.Quad(pVertices[5], pVertices[4], pVertices[3], pVertices[9], borderColor);
        FeatureApi.Quad(pVertices[8], pVertices[2], pVertices[1], pVertices[7], borderColor);
        FeatureApi.Quad(pVertices[7], pVertices[1], pVertices[0], pVertices[6], borderColor);
        this.#vertexCount += 24;
    }

    Render(drawCount) {
        modelViewMatrix = mult(modelViewMatrix, this.#translationMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, drawCount, this.#vertexCount);
    }
}