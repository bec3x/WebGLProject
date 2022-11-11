var TrafficCone = {
    topConeRadius: .05,
    bottomConeRadius: .38,

    numVertTrafficCone: 0,

    tranlastionMatrix: mat4(),

    baseVertices: [
        vec4(-0.5, 0, -0.5, 1),     // A
        vec4(0.5, 0, -0.5, 1),      // B
        vec4(0.5, 0, 0.5, 1),       // C
        vec4(-0.5, 0, 0.5, 1),      // D
        vec4(-0.5, -.1, -0.5, 1),   // E
        vec4(0.5, -.1, -0.5, 1),    // F
        vec4(0.5, -.1, 0.5, 1),     // G
        vec4(-0.5, -.1, 0.5, 1),    // H
    ],

    init: function (tranlastionMatrix = mat4()) {
        this.tranlastionMatrix = tranlastionMatrix;
        this.GenerateTrafficCone();
    },

    GenerateTrafficCone: function () {
        this.GenerateConeBase();
        this.GenerateCone();
    },

    GenerateCone: function () {
        var step = 100;
        var angle = 2 * Math.PI / step;
        var coneColor = FeatureApi.HexToColorVector('#FE5123');
        for (var i = 0; i < step; i++) {
            var theta = angle * i;
            var nextTheta = angle * (i + 1);

            var a = vec4(this.topConeRadius * Math.cos(theta), 1, this.topConeRadius * Math.sin(theta));
            var b = vec4(this.bottomConeRadius * Math.cos(theta), 0, this.bottomConeRadius * Math.sin(theta));
            var c = vec4(this.bottomConeRadius * Math.cos(nextTheta), 0, this.bottomConeRadius * Math.sin(nextTheta));
            var d = vec4(this.topConeRadius * Math.cos(nextTheta), 1, this.topConeRadius * Math.sin(nextTheta));

            FeatureApi.Quad(a, b, c, d, coneColor);
            this.numVertTrafficCone += 6;
        }
    },

    GenerateConeBase: function () {
        var baseColor = FeatureApi.HexToColorVector('#000000');

        FeatureApi.Quad(this.baseVertices[0], this.baseVertices[1], this.baseVertices[2], this.baseVertices[3], baseColor);
        this.numVertTrafficCone += 6;

        FeatureApi.Quad(this.baseVertices[4], this.baseVertices[5], this.baseVertices[6], this.baseVertices[7], baseColor);
        this.numVertTrafficCone += 6;

        FeatureApi.Quad(this.baseVertices[0], this.baseVertices[4], this.baseVertices[5], this.baseVertices[1], baseColor);
        this.numVertTrafficCone += 6;

        FeatureApi.Quad(this.baseVertices[1], this.baseVertices[5], this.baseVertices[6], this.baseVertices[2], baseColor);
        this.numVertTrafficCone += 6;

        FeatureApi.Quad(this.baseVertices[2], this.baseVertices[6], this.baseVertices[7], this.baseVertices[3], baseColor);
        this.numVertTrafficCone += 6;

        FeatureApi.Quad(this.baseVertices[3], this.baseVertices[7], this.baseVertices[4], this.baseVertices[0], baseColor);
        this.numVertTrafficCone += 6;
    },

    RenderTrafficCone: function (drawCount) {
        modelViewMatrix = mult(modelViewMatrix, this.tranlastionMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays(gl.TRIANGLES, drawCount, this.numVertTrafficCone);
        return drawCount += this.numVertTrafficCone;
    }
}

