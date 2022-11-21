class TrashCan {
    #vertexCount;
    #translationMatrix;
    #vertices;
    #trashCanPoints;

    constructor(translationMatrix = mat4()) {
        this.#vertexCount = 0;
        this.#translationMatrix = translationMatrix;
        this.#vertices = [];
        this.#trashCanPoints = [];
        this.#IntialPoints();
    }

    get VertexCount() {
        return this.#vertexCount;
    }

    Generate() {
        this.#DrawTrashCan();
    }

    //trash can initial 2d line points for surface of revolution
    //The points are defined from bottom up in the X-Y plane
    #IntialPoints() {
        var SIZE= 100; // slices
        var outterCenter = [0,3];
        var outterRadius = 2;    
	    var angle = 2*Math.PI/SIZE;

        // The Can points
        this.#trashCanPoints.push([outterRadius,0,0]);
        this.#trashCanPoints.push([outterRadius,3,0]);

        // The lid of the trash can
        for (var i = 0; i < SIZE/4; i++){
            this.#trashCanPoints.push(vec2(outterCenter[0]+outterRadius*Math.cos(i*angle), outterCenter[1]+outterRadius*Math.sin(i*angle)));
        }
    }

    #CreateMatrices(s, r, t) {
        return {
            s: FeatureApi.scale4(s[0], s[1], s[2]),
            r: rotate(r[0], r[1], r[2], r[3]),
            t: translate(t[0], t[1], t[2]),
        };
    }

    //Sets up the vertices array so the trashCan can be drawn
    #DrawTrashCan() {
        var baseColor = FeatureApi.HexToColorVector("9CA175");
        var lidColor = FeatureApi.HexToColorVector("565250");

	    //Setup initial points matrix
	    for (var i = 0; i<25; i++)
	    {
	    	this.#vertices.push(vec4(this.#trashCanPoints[i][0], this.#trashCanPoints[i][1], 
                                       this.#trashCanPoints[i][2], 1));
	    }

	    var r;
            var t=Math.PI/12;

            // sweep the original curve another "angle" degree
	    for (var j = 0; j < 24; j++)
	    {
                    var angle = (j+1)*t; 

                    // for each sweeping step, generate 25 new points corresponding to the original points
	    	for(var i = 0; i < 25 ; i++ )
	    	{	
	    	        r = this.#vertices[i][0];
                            this.#vertices.push(vec4(r*Math.cos(angle), this.#vertices[i][1], -r*Math.sin(angle), 1));
	    	}    	
	    }

           var N=52; 
           // quad strips are formed slice by slice (not layer by layer)
           //          ith slice      (i+1)th slice
           //            i*N+(j+1)-----(i+1)*N+(j+1)
           //               |              |
           //               |              |
           //            i*N+j --------(i+1)*N+j
           // define each quad in counter-clockwise rotation of the vertices
           for (var i=0; i<24; i++) // slices
           {
                for (var j=0; j<2; j++)  // layers
                {
                     FeatureApi.Quad(this.#vertices[i*N+j], this.#vertices[(i+1)*N+j], this.#vertices[(i+1)*N+(j+1)], this.#vertices[i*N+(j+1)], baseColor);
                     this.#vertexCount += 6; 
                } 
               for (var j=2; j<27; j++)  // layers
               {
	    			FeatureApi.Quad(this.#vertices[i*N+j], this.#vertices[(i+1)*N+j], this.#vertices[(i+1)*N+(j+1)], this.#vertices[i*N+(j+1)], lidColor);
                    this.#vertexCount += 6; 
               }
           }
        }

    Render(drawCount) {
        var matrices;

        modelViewStack.push(modelViewMatrix);
        matrices = this.#CreateMatrices([1,1,1],[0,0,1,0],[0,0,0]);
        modelViewMatrix = mult(mult(mult(mult(modelViewMatrix),this.#translationMatrix, matrices.t), matrices.r), matrices.s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, drawCount, this.#vertexCount);
        modelViewMatrix = modelViewStack.pop();
    }
}