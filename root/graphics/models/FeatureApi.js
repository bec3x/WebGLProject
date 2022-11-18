var FeatureApi = {
    Quad: function (a, b, c, d, color) {
        var t1 = subtract(b, a);
        var t2 = subtract(c, d);
        var normal = cross(t1, t2);
        var normal = vec3(normal);
        normal = normalize(normal);

        points.push(a);
        colors.push(color);
        normals.push(normal);

        points.push(b);
        colors.push(color);
        normals.push(normal);

        points.push(d);
        colors.push(color);
        normals.push(normal);

        points.push(d);
        colors.push(color);
        normals.push(normal);

        points.push(b);
        colors.push(color);
        normals.push(normal);

        points.push(c);
        colors.push(color);
        normals.push(normal);
    },

    Triangle: function (a, b, c, color) {
        var t1 = subtract(a, b);
        var t2 = subtract(c, b);
        var normal = cross(t1, t2);
        normal = vec3(normal);
        normal = normalize(normal);

        points.push(a);
        colors.push(color);
        normals.push(normal);

        points.push(b);
        colors.push(color);
        normals.push(normal);

        points.push(c);
        colors.push(color);
        normals.push(normal);
    },

    hexToDecimal: function (hex) {
        return parseInt(hex, 16);
    },

    HexToColorVector: function (hexVal) {
        if (typeof hexVal !== 'string' || hexVal.length != 7) return;
        vals = [];
        rgbVals = [];

        strippedHex = hexVal.substring(1, 7);

        for (var i = 0, j = 0; i < 3; i++, j += 2) {
            vals.push(strippedHex.substring(j, j + 2));
        }

        vals.forEach((hex) => {
            rgbVals.push(this.hexToDecimal(hex) / 255);
        });

        return vec4(rgbVals[0], rgbVals[1], rgbVals[2], 1.0);
    },

    scale4: function (a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
    },
}


var MouseManipulation = {
    targetElement: "",

    phi: 1,
    theta: 0.5,
    radius: 1,
    dr: 2.0 * Math.PI / 180,

    mouseDownRight: false,
    mouseDownLeft: false,

    mousePosX: 0,
    mousePosY: 0,

    translateX: 0,
    translateY: 0,

    init: function (targetElement) {
        this.targetElement = targetElement;
        this._RegisterEvents();
    },

    _RegisterEvents: function () {
        document.getElementById(this.targetElement).addEventListener("mousedown", function (e) {
            if (e.which == 1) {
                MouseManipulation.mouseDownLeft = true;
                MouseManipulation.mouseDownRight = false;
                MouseManipulation.mousePosX = e.x;
                MouseManipulation.mousePosY = e.y;
            }
            else if (e.which == 3) {
                MouseManipulation.mouseDownRight = true;
                MouseManipulation.mouseDownLeft = false;
                MouseManipulation.mousePosY = e.y;
                MouseManipulation.mousePosX = e.x;
            }

            Render();
        });

        document.getElementById(this.targetElement).addEventListener("mouseup", function (e) {
            MouseManipulation.mouseDownLeft = false;
            MouseManipulation.mouseDownRight = false;
            Render();
        });

        document.getElementById(this.targetElement).addEventListener("mousemove", function (e) {
            if (MouseManipulation.mouseDownRight) {
                MouseManipulation.translateX += (e.x - MouseManipulation.mousePosX) / 30;
                MouseManipulation.mousePosX = e.x;

                MouseManipulation.translateY -= (e.y - MouseManipulation.translateY) / 30;
                MouseManipulation.mousePosY = e.y;
            } else if (MouseManipulation.mouseDownLeft) {
                MouseManipulation.phi += (e.x - MouseManipulation.mousePosX) / 100;
                MouseManipulation.mousePosX = e.x;

                MouseManipulation.theta += (e.y - MouseManipulation.mousePosY) / 100;
                MouseManipulation.mousePosY = e.y;
            }

            Render();
        });
    }
};

var Primitive = {
    numCubePrimitives: 0,
    numSpherePrimitives: 0,
    numCylinderPrimitves: 0,
    numConePrimitives: 0,

    //CONE
    numVertCone: 600,
    GenerateCone: function (color) {
        var slices=100; // slices
        var center = [0,0,0];
        var radius = 1;
        var angle = 2*Math.PI/slices;
        var a,b,c;
        var height = 1;
    
        for (var i = 0; i < slices; i++) {
            //Side of cone
            a = vec4(center[0]+radius*Math.cos(i*angle), center[1], center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), center[1],center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], height, center[1]);
            FeatureApi.Triangle(a, c, b, color);
    
            //Bottom circle
            a = vec4(center[0]+radius*Math.cos(i*angle), center[1], center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), center[1],center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], center[1], center[1]);
            FeatureApi.Triangle(c, b, a, color);
        }
        this.numConePrimitives++;
    },
    DrawCone: function (startIndex) {
        modelViewStack.push(modelViewMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        gl.drawArrays( gl.TRIANGLES, tjis.numCubePrimitives * this.numVertCube + this.sphereCount * this.numSpherePrimitives + this.numVertCylinder * this.numCylinderPrimitves + startIndex * this.numVertCone, this.numVertCone);
    
        modelViewMatrix = modelViewStack.pop();        
    },

    //CUBE
    numVertCube: 36,
    GenerateCube: function(color) {
        var cubeVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

    //var color = vec4(0,0,0,1);

    FeatureApi.Quad( cubeVertices[1], cubeVertices[0], cubeVertices[3], cubeVertices[2], color );
    FeatureApi.Quad( cubeVertices[2], cubeVertices[3], cubeVertices[7], cubeVertices[6], color );
    FeatureApi.Quad( cubeVertices[3], cubeVertices[0], cubeVertices[4], cubeVertices[7], color );
    FeatureApi.Quad( cubeVertices[6], cubeVertices[5], cubeVertices[1], cubeVertices[2], color );
    FeatureApi.Quad( cubeVertices[4], cubeVertices[5], cubeVertices[6], cubeVertices[7], color );
    FeatureApi.Quad( cubeVertices[5], cubeVertices[4], cubeVertices[0], cubeVertices[1], color );

    this.numCubePrimitives++;
    },
    DrawCube: function (startIndex) {
        modelViewStack.push(modelViewMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        gl.drawArrays( gl.TRIANGLES, startIndex * this.numVertCube, this.numVertCube);
    
        modelViewMatrix = modelViewStack.pop();        
    },

    //SPHERE
    sphereCount: 12288,
    GenerateSphere: function (color) {
        var va = vec4(0.0, 0.0, -1.0,1);
        var vb = vec4(0.0, 0.942809, 0.333333, 1);
        var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
        var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
        this.tetrahedron(va, vb, vc, vd, 5, color);
        this.numSpherePrimitives++;        
    },
    DrawSphere: function (startIndex,radius) {
        modelViewStack.push(modelViewMatrix);
        s= FeatureApi.scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
         // draw unit radius sphere
        for( var i=0; i<this.sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, startIndex * this.sphereCount + this.numVertCube * this.numCubePrimitives + i, 3 );
    
        modelViewMatrix = modelViewStack.pop();
    },

    //CYLINDER
    numVertCylinder: 0,
    GenerateCylinder: function (color) {
        var slices=100; // slices
        var center = [0,0,0];
        var radius = 1;
        var angle = 2*Math.PI/slices;
        var a,b,c,d;
        var height = 2;
    
        for (var i = 0; i < slices; i++) {
            //Top circle
            a = vec4(center[0]+radius*Math.cos(i*angle), height, center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), height,center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], height, center[1]);
            FeatureApi.Triangle(a, b, c, color);
    
            //Bottom circle
            a = vec4(center[0]+radius*Math.cos(i*angle), center[1], center[1]+radius*Math.sin(i*angle));
            b = vec4(center[0]+radius*Math.cos((i+1)*angle), center[1],center[1]+radius*Math.sin((i+1)*angle));
            c = vec4(center[0], center[1], center[1]);
            FeatureApi.Triangle(c, b, a, color);
    
            //Cylinder
            a = vec4(radius * Math.cos(i * angle), height, radius * Math.sin(i * angle));
            b = vec4(radius * Math.cos(i * angle), 0, radius * Math.sin(i * angle));
            c = vec4(radius * Math.cos((i + 1) * angle), 0, radius * Math.sin((i + 1) * angle));
            d = vec4(radius * Math.cos((i + 1) * angle), height, radius * Math.sin((i + 1) * angle));
            FeatureApi.Quad(a, b, c, d, color);
            this.numVertCylinder += 12;
        }
        this.numCylinderPrimitves++;
    },
    DrawCylinder: function (startIndex) {
        modelViewStack.push(modelViewMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        gl.drawArrays( gl.TRIANGLES, this.numVertCube * this.numCubePrimitives + this.sphereCount * this.numSpherePrimitives + startIndex * this.numVertCylinder, this.numVertCylinder );
    
        modelViewMatrix = modelViewStack.pop();
    },
    
    //Tetrahedron
    divideTriangle: function (a, b, c, count, color) 
    {
        if ( count > 0 ) 
        {
            var ab = mix( a, b, 0.5);
            var ac = mix( a, c, 0.5);
            var bc = mix( b, c, 0.5);
                    
            ab = normalize(ab, true);
            ac = normalize(ac, true);
            bc = normalize(bc, true);
                                    
            this.divideTriangle( a, ab, ac, count - 1 , color);
            this.divideTriangle( ab, b, bc, count - 1 , color);
            this.divideTriangle( bc, c, ac, count - 1 , color);
            this.divideTriangle( ab, bc, ac, count - 1 , color);
        }
        else { 
           FeatureApi.Triangle( a, b, c ,color);
        }
    },
    tetrahedron: function (a, b, c, d, n, color) 
    {
            this.divideTriangle(a, b, c, n, color);
            this.divideTriangle(d, c, b, n, color);
            this.divideTriangle(a, d, b, n, color);
            this.divideTriangle(a, c, d, n, color);
    }
};