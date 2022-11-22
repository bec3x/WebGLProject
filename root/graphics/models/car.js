class Car {
    #bodyVertCount;
    #wheelVertCount;
    #hubcapVertCount;
    #translationMatrix;
    #carAnimated = false;
    #carStepCount = 0;
    #CAR_SPEED = 200;
    #location;
    #startLocation;

    constructor(translationMatrix = mat4()) {
        this.#bodyVertCount = 0;
        this.#wheelVertCount = 0;
        this.#hubcapVertCount = 0;
        this.#translationMatrix = translationMatrix;

        this.#startLocation = {
            x: this.#translationMatrix[0][3],
            y: this.#translationMatrix[1][3],
            z: this.#translationMatrix[2][3],

        };

        this.#location = {
            x: this.#translationMatrix[0][3],
            y: this.#translationMatrix[1][3],
            z: this.#translationMatrix[2][3],
        };
    }

    get VertexCount() {
        return this.#bodyVertCount + (this.#wheelVertCount * 4) + ((this.#hubcapVertCount * 2) * 4);
    }

    get CarAnimated() {
        return this.#carAnimated;
    }

    get TranslationMatrix() {
        return this.#translationMatrix;
    }

    set TranslationMatrix(value) {
        if (value == this.#translationMatrix || value == null) return;
        this.#translationMatrix = value;
    }

    set CarAnimated(value) {
        this.#carAnimated = value;
    }
    
    DriveCar(matrix) {
        this.#translationMatrix = add(this.#translationMatrix, matrix);
    }

    Render(drawCount) {
        if (drawCount == null) {
            console.log("CAR: drawCount value was null");
            return;
        }

        if (this.#carAnimated) {
            if (this.#carStepCount < this.#CAR_SPEED) {
                var deltaX = (62 - this.#location.x) / this.#CAR_SPEED;

                this.#translationMatrix = translate(this.#location.x, this.#location.y, this.#location.z);
                
                this.#location.x = this.#location.x + deltaX;
                this.#carStepCount++;
            }
            else {
                this.#carAnimated = false;
            }
        }
        else if (!this.#carAnimated && this.#carStepCount >= this.#CAR_SPEED) {
            this.#carAnimated = false;
            this.#carStepCount = 0;
            this.#translationMatrix = translate(this.#startLocation.x, this.#startLocation.y, this.#startLocation.z);
            this.#location.x = this.#startLocation.x;
            this.#location.y = this.#startLocation.y;
            this.#location.z = this.#startLocation.z;
        }

        // Render Body
        modelViewMatrix = mult(modelViewMatrix, mult(this.#translationMatrix, FeatureApi.scale4(4, 4, 4)));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays(gl.TRIANGLES, drawCount, this.#bodyVertCount);
        drawCount += this.#bodyVertCount;

        // Render Wheels
        var s, r, t;
        s = FeatureApi.scale4(0.14, 0.05, 0.14);
        r = rotate(90, 1, 0, 0);
        for (var i = 0; i < 4; i++) {
            modelViewStack.push(modelViewMatrix);
            
            switch (i) {
                case 0:
                    t = translate(0.32, -.07, 0.32);
                    break;
                case 1:
                    t = translate(0.32, -.07, -0.42);
                    break;
                case 2:
                    t = translate(-0.32, -.07, 0.32);
                    break;
                case 3:
                    t = translate(-0.32, -.07, -0.42);
                    break;
            }

            modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

            Primitive.DrawCylinder(drawCount);
            drawCount += this.#wheelVertCount;
            modelViewMatrix = modelViewStack.pop();
        }
    }

    Generate() {
        this.#DrawBody();
        this.#DrawCabin();

        for (var i = 0; i < 4; i++) {
            this.#DrawWheel(i == 0 ? true : false);
        }
    }

    #DrawWheel(accumulate) {
        var wheelColor = FeatureApi.HexToColorVector("#000000");
        Primitive.GenerateCylinder(wheelColor);
        if (accumulate) {
            this.#wheelVertCount += Primitive.cylinderVertexCount;
        }
    }

    #DrawBody() {
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
        this.#DrawBox(vertices, baseColor);
    }

    #DrawCabin() {
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
        this.#DrawBox(vertices, baseColor);
    }

    #DrawBox(vertices, baseColor) {
        FeatureApi.Quad(vertices[0], vertices[1], vertices[2], vertices[3], baseColor);
        this.#bodyVertCount += 6;

        FeatureApi.Quad(vertices[4], vertices[5], vertices[6], vertices[7], baseColor);
        this.#bodyVertCount += 6;

        FeatureApi.Quad(vertices[0], vertices[4], vertices[5], vertices[1], baseColor);
        this.#bodyVertCount += 6;

        FeatureApi.Quad(vertices[1], vertices[5], vertices[6], vertices[2], baseColor);
        this.#bodyVertCount += 6;

        FeatureApi.Quad(vertices[2], vertices[6], vertices[7], vertices[3], baseColor);
        this.#bodyVertCount += 6;

        FeatureApi.Quad(vertices[3], vertices[7], vertices[4], vertices[0], baseColor);
        this.#bodyVertCount += 6;
    }
}