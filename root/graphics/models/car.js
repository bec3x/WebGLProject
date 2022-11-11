var Car = {
    bodyVertCount: 0,
    wheelVertCount: 0,

    translationMatrix: mat4(),

    init: function (translationMatrix = mat4()) {
        this.translationMatrix = translationMatrix;
        this.GenerateCar();
    },

    RenderCar: function (drawCount) {
        // Render Body
        modelViewMatrix = mult(modelViewMatrix, mult(this.translationMatrix, FeatureApi.scale4(4, 4, 4)));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays(gl.TRIANGLES, drawCount, this.bodyVertCount);
        drawCount += this.bodyVertCount;

        // Render Wheels
        for (var i = 0; i < 4; i++) {
            modelViewStack.push(modelViewMatrix);
            var t;
            switch (i) {
                case 0:
                    t = translate(0.32, -.07, 0.37);
                    break;
                case 1:
                    t = translate(0.32, -.07, -0.42);
                    break;
                case 2:
                    t = translate(-0.32, -.07, 0.37);
                    break;
                case 3:
                    t = translate(-0.32, -.07, -0.42);
                    break;
            }

            modelViewMatrix = mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

            gl.drawArrays(gl.TRIANGLES, drawCount, this.wheelVertCount); drawCount += this.wheelVertCount;
            gl.drawArrays(gl.TRIANGLE_FAN, drawCount, 100); drawCount += 100;
            gl.drawArrays(gl.TRIANGLE_FAN, drawCount, 100); drawCount += 100;

            modelViewMatrix = modelViewStack.pop();
        }

        return drawCount;
    },

    GenerateCar: function () {
        this.DrawBody();
        this.DrawCabin();

        for (var i = 0; i < 4; i++) {
            this.DrawWheel(i == 0 ? true : false);
        }
    },

    DrawWheel: function (accumulate) {
        var radius = .14;
        var steps = 100;
        var angle = 2 * Math.PI / steps;

        topCirclePoints = [];
        bottomCirclePoints = [];

        var wheelColor = FeatureApi.HexToColorVector("#000000");
        for (var i = 0; i < steps; i++) {
            var theta = angle * i;
            var nextTheta = angle * (i + 1);

            var a = vec4(radius * Math.cos(theta), radius * Math.sin(theta), .05, 1);
            var b = vec4(radius * Math.cos(theta), radius * Math.sin(theta), 0, 1);
            var c = vec4(radius * Math.cos(nextTheta), radius * Math.sin(nextTheta), 0, 1);
            var d = vec4(radius * Math.cos(nextTheta), radius * Math.sin(nextTheta), .05, 1);

            FeatureApi.Quad(a, b, c, d, wheelColor);

            var topCircle = vec4(radius * Math.cos(theta), radius * Math.sin(theta), .05, 1);
            topCirclePoints.push(topCircle);
            colors.push(wheelColor);

            var bottomCircle = vec4(radius * Math.cos(theta), radius * Math.sin(theta), 0, 1);
            bottomCirclePoints.push(bottomCircle);
            colors.push(wheelColor);

            if (accumulate)
                this.wheelVertCount += 6;
        }

        topCirclePoints.forEach((item) => points.push(item));
        bottomCirclePoints.forEach((item) => points.push(item));
    },

    DrawBody: function () {
        var vertices = [
            vec4(-0.5, 0.15, -0.4, 1.0),    // A
            vec4(0.5, 0.15, -0.4, 1.0),     // B
            vec4(0.5, 0.15, 0.4, 1.0),      // C
            vec4(-0.5, 0.15, 0.4, 1.0),     // D
            vec4(-0.5, -0.15, -0.4, 1.0),   // E
            vec4(0.5, -0.15, -0.4, 1.0),    // F
            vec4(0.5, -0.15, 0.4, 1.0),     // G
            vec4(-0.5, -0.15, 0.4, 1.0),    // H
        ];

        var baseColor = FeatureApi.HexToColorVector('#a40000');
        this.DrawBox(vertices, baseColor);
    },

    DrawCabin: function () {
        var vertices = [
            vec4(-0.25, 0.3, -0.4, 1),  // A
            vec4(0.25, 0.3, -0.4, 1),   // B
            vec4(0.25, 0.3, 0.4, 1),    // C
            vec4(-0.25, 0.3, 0.4, 1),   // D
            vec4(-0.25, 0.15, -0.4, 1), // E
            vec4(0.25, 0.15, -0.4, 1),  // F
            vec4(0.25, 0.15, 0.4, 1),   // G
            vec4(-0.25, 0.15, 0.4, 1),  // H
        ];

        var baseColor = FeatureApi.HexToColorVector('#95e1c8');
        this.DrawBox(vertices, baseColor);
    },

    DrawBox: function (vertices, baseColor) {
        FeatureApi.Quad(vertices[0], vertices[1], vertices[2], vertices[3], baseColor);
        this.bodyVertCount += 6;

        FeatureApi.Quad(vertices[4], vertices[5], vertices[6], vertices[7], baseColor);
        this.bodyVertCount += 6;

        FeatureApi.Quad(vertices[0], vertices[4], vertices[5], vertices[1], baseColor);
        this.bodyVertCount += 6;

        FeatureApi.Quad(vertices[1], vertices[5], vertices[6], vertices[2], baseColor);
        this.bodyVertCount += 6;

        FeatureApi.Quad(vertices[2], vertices[6], vertices[7], vertices[3], baseColor);
        this.bodyVertCount += 6;

        FeatureApi.Quad(vertices[3], vertices[7], vertices[4], vertices[0], baseColor);
        this.bodyVertCount += 6;
    },
}


