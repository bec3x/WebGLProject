class BusStop {
    #translationMatrix;
    #coverVertexCount;
    #poleVertexCount;
    #paneVertexCount;
    #poleCount = 4;
    #paneCount = 3;
    #vertexCount;
    #vertices;
    #coverWidth;
    #N;

    constructor(translationMatrix = mat4()) {
        this.#translationMatrix = translationMatrix;
        this.#vertexCount = 0;
        this.#coverVertexCount = 0;
        this.#poleVertexCount = 0;
    }

    get VertexCount() {
        return this.#vertexCount;
    }

    GenerateBusStop() {
        this.#GenerateCover();
        this.#vertexCount += this.#coverVertexCount;

        this.#GenerateVestibule();
    }

    RenderBusStop(drawCount) {
        modelViewMatrix = mult(modelViewMatrix, this.#translationMatrix);

        modelViewStack.push(modelViewMatrix);
        drawCount = this.#RenderCover(drawCount);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        drawCount = this.#RenderPoles(drawCount);
        modelViewMatrix = modelViewStack.pop();

        modelViewStack.push(modelViewMatrix);
        drawCount = this.#RenderPanes(drawCount);
        modelViewMatrix = modelViewStack.pop();
    }

    #GenerateCover() {
        this.#coverWidth = 2;
        var a = 1.5;
        var b = 2.5;

        var num = 10;
        var alpha = Math.PI / num;
        
        this.#vertices = [vec4(0, 0, (this.#coverWidth / 2) * -1, 1)];
        for (var i = num; i >= 0; i--)
        {
            var theta = alpha * i;
            this.#vertices.push(vec4(b * Math.cos(theta), a * Math.sin(theta), (this.#coverWidth / 2) * -1, 1));
        }
    
        this.#N = this.#vertices.length;
    
        for (var i = 0; i < this.#N; i++)
        {
            this.#vertices.push(vec4(this.#vertices[i][0], this.#vertices[i][1], this.#vertices[i][2] + this.#coverWidth, 1));
        }
    
        this.#ExtrudedShape();
    }

    #ExtrudedShape() {
        var coverColor = FeatureApi.HexToColorVector("#0000FF");
        var basePoints = [];
        var topPoints = [];
        
     
        for (var j = 0; j < this.#N; j++)
        {
            FeatureApi.Quad(this.#vertices[j], 
                            this.#vertices[j + this.#N], 
                            this.#vertices[(j + 1) % this.#N + this.#N], 
                            this.#vertices[(j + 1) % this.#N], 
                            coverColor);
            this.#coverVertexCount += 6; 
        }
    
        basePoints.push(0);
        for (var i = this.#N - 1; i > 0; i--)
        {
            basePoints.push(i);  
        }

        FeatureApi.Polygon(this.#vertices, basePoints, coverColor);
        this.#coverVertexCount += (basePoints.length - 2) * 3;
    
        for (var i = 0; i < this.#N; i++)
        {
            topPoints.push(i + this.#N);
        }

        FeatureApi.Polygon(this.#vertices, topPoints, coverColor);
        this.#coverVertexCount += (topPoints.length - 2) * 3;
    }

    #GenerateVestibule() {
        this.#CreatePoles();
        this.#vertexCount += this.#poleVertexCount * this.#poleCount;

        this.#CreatePanes();
        this.#vertexCount += this.#paneVertexCount * this.#paneCount;
    }

    #CreatePoles() {
        var poleColor = FeatureApi.HexToColorVector("#838383");
        for (var i = 0; i < this.#poleCount; i++) {
            Primitive.GenerateCylinder(poleColor);
        }

        this.#poleVertexCount = Primitive.cylinderVertexCount;
    }

    #CreatePanes() {
        var paneColor = FeatureApi.HexToColorVector("#95e1c8");

        for (var i = 0; i < this.#paneCount; i++) {
            Primitive.GenerateCube(paneColor);
        }

        this.#paneVertexCount = Primitive.cubeVertexCount;
    }

    #RenderCover(drawCount) {
        modelViewMatrix = mult(modelViewMatrix, translate(0, 4, 0));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays(gl.TRIANGLES, drawCount, this.#coverVertexCount);
        return drawCount += this.#coverVertexCount;
    }

    #RenderPoles(drawCount) {
        modelViewMatrix = mult(modelViewMatrix, FeatureApi.scale4(1/8, 2, 1/8));

        for (var i = 0; i < this.#poleCount; i++) {
            var t;

            modelViewStack.push(modelViewMatrix);
            if (i == 0) {
                t = translate(-19, 0, 7);
            }
            else if (i == 1) {
                t = translate(-19, 0, -7);
            }
            else if (i == 2) {
                t = translate(19, 0, 7);                
            }
            else if (i == 3) {
                t = translate(19, 0, -7);
            }

            modelViewMatrix = mult(modelViewMatrix, t);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays(gl.TRIANGLES, drawCount, this.#poleVertexCount);
            drawCount += this.#poleVertexCount;
            modelViewMatrix = modelViewStack.pop();
        }       

        return drawCount;
    }

    #RenderPanes(drawCount) {
        for (var i = 0; i < this.#paneCount; i++) {
            var s, r, t;

            modelViewStack.push(modelViewMatrix);
            if (i == 0) {
                s = FeatureApi.scale4(1/8, 4, 1.5);
                r = rotate(0, 0, 1, 0);
                t = translate(-2.4, 2, 0);
            }
            else if (i == 1) {
                s = FeatureApi.scale4(1/8, 4, 1.5);                
                r = rotate(0, 0, 1, 0);
                t = translate(2.4, 2, 0);
            }
            else if (i == 2) {
                s = FeatureApi.scale4(1/8, 4, 4.5);
                r = rotate(90, 0, 1, 0);
                t = translate(0, 2, -1);                
            }

            modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.drawArrays(gl.TRIANGLES, drawCount, this.#paneVertexCount);
            drawCount += this.#paneVertexCount;
            modelViewMatrix = modelViewStack.pop();
        }       

        return drawCount;
    }
}

