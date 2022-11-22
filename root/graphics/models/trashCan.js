class TrashCan {
    #vertexCount;
    #translationMatrix;

    get VertexCount() {
        return this.#vertexCount;
    }

    constructor(translationMatrix = mat4()) {
        this.#translationMatrix = translationMatrix;
        this.#vertexCount = 0;
    }

    Generate() {
        this.#GenerateTrashCan();
    }

    #GenerateTrashCan() {
        var baseVerts = [];
        var lidVerts = [];
        var holeVerts = [];
        var slices, stacks;
        var prev, curr;
        var baseColor = FeatureApi.HexToColorVector("#9CA175");
        var lidColor = FeatureApi.HexToColorVector("#565250");
        var holeColor = FeatureApi.HexToColorVector("#000000");
        var radius = 2;
        var v4;

        // Generate the base of the trash can
        baseVerts.push(vec4(2, 0, 0, 1));
        baseVerts.push(vec4(2, 5, 0, 1));

        // Generate the lid of the trash can
        // generate almost quarter circle: 0 --> PI/4 
        // points are defined from top to bottom in the XY-plane
        slices = 24;
        stacks = 8;
        var sliceInc = 2 * Math.PI / slices;
        var stackInc = Math.PI / (2.5 * stacks);
        for (var phi = 0; phi <= Math.PI / 2.35; phi += stackInc)
            lidVerts.push(vec4(radius * Math.cos(phi), radius * Math.sin(phi) + 5, 0, 1));

        // Generate the hole of the trash can

        holeVerts.push(vec4(0, radius * Math.sin(Math.PI / 2.35) + 4.8, 0, 1));
        holeVerts.push(vec4(4 * Math.cos(Math.PI / 2.35), radius * Math.sin(Math.PI / 2.5) + 4.8, 0, 1));


        // Generate the quads of the trash can
        prev = baseVerts;
        slices = 24;
        stacks = 1;


        // rotate around y axis
        var m = rotate(360 / slices, 0, 1, 0);

        for (var i = 0; i < slices; i++) {

            curr = [];

            // compute the new set of points with one rotation

            for (var j = 0; j <= stacks; j++) {
                v4 = this.#multiply(m, prev[j]);
                curr.push(v4);
            }

            // create the quads(triangles) for this slice
            //         ith slice      (i+1)th slice
            //           prev[j] ------ curr[j]
            //             |               |
            //             |               |
            //           prev[j+1] ---  curr[j+1]
            // each quad is defined with points specified in counter-clockwise rotation
            for (var j = 0; j < stacks; j++) {
                FeatureApi.Quad(prev[j + 1], curr[j + 1], curr[j], prev[j], baseColor);
                this.#vertexCount += 6;
            }
            prev = curr;
        }

        prev = lidVerts;
        slices = 24;
        stacks = 8;

        // rotate around y axis
        m = rotate(360 / slices, 0, 1, 0);
        for (var i = 0; i < slices; i++) {
            curr = [];
            // compute the new set of points with one rotation
            for (var j = 0; j < stacks; j++) {
                v4 = this.#multiply(m, prev[j]);
                curr.push(v4);
            }

            // create the quads(triangles) for this slice
            //         ith slice      (i+1)th slice
            //           prev[j] ------ curr[j]
            //             |               |
            //             |               |
            //           prev[j+1] ---  curr[j+1]
            // each quad is defined with points specified in counter-clockwise rotation
            for (var j = 0; j < stacks; j++) {
                //console.log(curr);
                FeatureApi.Quad(prev[j], prev[(j + 1) % stacks], curr[(j + 1) % stacks], curr[j], lidColor);
                this.#vertexCount += 6;
            }
            prev = curr;
        }

        // Generate the quads of the trash can
        prev = holeVerts;
        slices = 24;
        stacks = 1;


        // rotate around y axis
        var m = rotate(360 / slices, 0, 1, 0);

        for (var i = 0; i < slices; i++) {

            curr = [];

            // compute the new set of points with one rotation

            for (var j = 0; j <= stacks; j++) {
                v4 = this.#multiply(m, prev[j]);
                curr.push(v4);
            }

            // create the quads(triangles) for this slice
            //         ith slice      (i+1)th slice
            //           prev[j] ------ curr[j]
            //             |               |
            //             |               |
            //           prev[j+1] ---  curr[j+1]
            // each quad is defined with points specified in counter-clockwise rotation
            for (var j = 0; j < stacks; j++) {
                FeatureApi.Quad(prev[j + 1], curr[j + 1], curr[j], prev[j], holeColor);
                this.#vertexCount += 6;
            }
            prev = curr;
        }
    }

    Render(drawCount) {
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, this.#translationMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, drawCount, this.#vertexCount);
        modelViewMatrix = modelViewStack.pop();
    }

        // a 4x4 matrix multiple by a vec4
    #multiply(m, v) {
        var vv = vec4(
            m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
            m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
            m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
            1);
        return vv;
    }
}
