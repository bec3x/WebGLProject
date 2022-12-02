class Car {
    #bodyVertCount;
    #wheelVertCount;
    #hubcapVertCount;
    #translationMatrix;
    #headLightVertexCount;
    #carSound;
    #soundStartTime = 2;

    constructor(translationMatrix = mat4(), carSound) {
        this.#bodyVertCount = 0;
        this.#wheelVertCount = 0;
        this.#hubcapVertCount = 0;
        this.#headLightVertexCount = 0;

        this.#translationMatrix = translationMatrix;
        this.#carSound = carSound;
        this.#carSound.currentTime = this.#soundStartTime;
    }

    get VertexCount() {
        return this.#bodyVertCount + (this.#wheelVertCount * 4) + ((this.#hubcapVertCount * 2) * 4) + this.#headLightVertexCount * 2;
    }

    get Location() {
        return vec3(this.#translationMatrix[0][3],
                    this.#translationMatrix[1][3],
                    this.#translationMatrix[2][3]);
    }

    set TranslationMatrix(value) {
        this.#translationMatrix = value;
    }
    
    DriveCar(movements) {
        this.#CreateDriveMatrix(movements);
    }

    #CreateDriveMatrix(movements) {
        var rotationAngle = 5;
        if (movements.KeyD && (movements.KeyW || movements.KeyS)) {
            this.#translationMatrix = mult(this.#translationMatrix, rotate(rotationAngle * -1, 0, 1, 0));
            this.#PlaySound();
        }
        
        if (movements.KeyA && (movements.KeyW || movements.KeyS)) {
            this.#translationMatrix = mult(this.#translationMatrix, rotate(rotationAngle, 0, 1, 0));
            this.#PlaySound();
        }
        
        if (movements.KeyW) {
            this.#translationMatrix = mult(this.#translationMatrix, translate(.5, 0, 0));
            this.#PlaySound();
        }

        if (movements.KeyS) {
            this.#translationMatrix = mult(this.#translationMatrix, translate(-.5, 0, 0));
            this.#PlaySound();
        }
    }

    CancelSound() {
        if (!this.#carSound.paused) {
            this.#carSound.pause();
            this.#carSound.currentTime = this.#soundStartTime;
        }
    }

    #PlaySound() {
        if (this.#carSound.paused) {
            this.#carSound.play();
        }

        if (this.#carSound.currentTime > 20) {
            this.#carSound.currentTime = this.#soundStartTime;
        }
    }

    Render(drawCount) {
        if (drawCount == null) {
            console.log("CAR: drawCount value was null");
            return;
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

        // Render HeadLights here
        for (var i = -1; i < 2; i += 2) {
            modelViewStack.push(modelViewMatrix);
            modelViewMatrix = mult(mult(modelViewMatrix, translate(.45, 0, .2 * i)), FeatureApi.scale4(1/10, 1/10, 1/10));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            Primitive.DrawSphere(drawCount);
            drawCount += this.#headLightVertexCount;
            modelViewMatrix = modelViewStack.pop();
        }
    }

    Generate() {
        this.#DrawBody();
        this.#DrawCabin();

        for (var i = 0; i < 4; i++) {
            this.#DrawWheel(i == 0 ? true : false);
        }

        this.#DrawHeadLights();
    }

    #DrawHeadLights() {
        var headLightColor = FeatureApi.HexToColorVector("#EEDD82");

        Primitive.GenerateSphere(headLightColor);
        Primitive.GenerateSphere(headLightColor);
        this.#headLightVertexCount += Primitive.sphereVertexCount;
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