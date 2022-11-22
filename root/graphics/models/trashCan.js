var vertices=[];
var numVertTrashCan =  0;

//Sets up the vertices array so the trashCan can be drawn
function Generate()
{
    var baseVerts = [];
    var lidVerts = [];
    var holeVerts = [];
	var slices, stacks;
    var prev, curr;
    var baseColor = FeatureApi.HexToColorVector("9CA175");
    var lidColor = FeatureApi.HexToColorVector("565250");
    var radius = 2;
    var v4;

    // Generate the base of the trash can
    baseVerts.push(vec4(2,0,0,1));
    baseVerts.push(vec4(2,3,0,1));

    // Generate the lid of the trash can
    // generate almost quarter circle: 0 --> PI/4 
    // points are defined from top to bottom in the XY-plane
    slices = 24;
    stacks = 8;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;
    for (var phi=0; phi<=Math.PI/4; phi+=stackInc) 
       lidVerts.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi) + 3, 0, 1));

    // Generate the hole of the trash can
    
    // Generate the quads of the trash can
    prev = baseVerts;
    slices = 24;
    stacks = 1;


    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<slices; i++) {
        
        curr=[];
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // create the quads(triangles) for this slice
        //         ith slice      (i+1)th slice
        //           prev[j] ------ curr[j]
        //             |               |
        //             |               |
        //           prev[j+1] ---  curr[j+1]
        // each quad is defined with points specified in counter-clockwise rotation
        for (var j=0; j<stacks; j++) { 
            FeatureApi.Quad(prev[j], prev[j+1], curr[j+1], curr[j],baseColor);
            numVertTrashCan += 6;
        }	
        prev = curr;  
    }

    prev = lidVerts;
    slices = 24;
    stacks = 8;

    // rotate around y axis
    m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<slices; i++) {
        
        curr=[];
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            v4 = multiply(m, prev[j]);
            //console.log(v4);

            curr.push( v4 );
            //console.log(curr);

        }

        // create the quads(triangles) for this slice
        //         ith slice      (i+1)th slice
        //           prev[j] ------ curr[j]
        //             |               |
        //             |               |
        //           prev[j+1] ---  curr[j+1]
        // each quad is defined with points specified in counter-clockwise rotation
        for (var j=0; j<stacks; j++) { 
            //console.log(curr);
            FeatureApi.Quad(prev[j], prev[j+1], curr[j+1], curr[j],lidColor);
            numVertTrashCan += 6;
        }
        prev = curr;  
    }
}

var RenderTrashCan = function()
{           
    modelViewStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0 , numVertTrashCan);
    modelViewMatrix = modelViewStack.pop();
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     1);
    return vv;
}