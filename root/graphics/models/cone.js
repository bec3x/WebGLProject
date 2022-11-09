var topConeRadius = .05;
var bottomConeRadius = .38;

var numVertTrafficCone = 0;

const GenerateTrafficCone = () => {
    GenerateConeBase();
    GenerateCone();
}

var baseVertices = [
    vec4(-0.5, 0, -0.5, 1), // A
    vec4(0.5, 0, -0.5, 1), // B
    vec4(0.5, 0, 0.5, 1), // C
    vec4(-0.5, 0, 0.5, 1), // D
    vec4(-0.5, -.1, -0.5, 1), // E
    vec4(0.5, -.1, -0.5, 1), // F
    vec4(0.5, -.1, 0.5, 1), // G
    vec4(-0.5, -.1, 0.5, 1), // H
]

var step = 100;
var angle = 2 * Math.PI / step;
const GenerateCone = () => {

    var coneColor = vec4(.996, .317, .137, 1);
    for (var i = 0; i < step; i++) {
        var theta = angle * i;
        var nextTheta = angle * (i + 1);

        var a = vec4(topConeRadius * Math.cos(theta), 1, topConeRadius * Math.sin(theta));
        var b = vec4(bottomConeRadius * Math.cos(theta), 0, bottomConeRadius * Math.sin(theta));
        var c = vec4(bottomConeRadius * Math.cos(nextTheta), 0, bottomConeRadius * Math.sin(nextTheta));
        var d = vec4(topConeRadius * Math.cos(nextTheta), 1, topConeRadius * Math.sin(nextTheta));

        Quad(a, b, c, d, coneColor);
        numVertTrafficCone += 6;
    }

}

const GenerateConeBase = () => {
    var baseColor = vec4(0, 0, 0, 1);

    Quad(baseVertices[0], baseVertices[1], baseVertices[2], baseVertices[3], baseColor);
    numVertTrafficCone += 6;

    Quad(baseVertices[4], baseVertices[5], baseVertices[6], baseVertices[7], baseColor);
    numVertTrafficCone += 6;

    Quad(baseVertices[0], baseVertices[4], baseVertices[5], baseVertices[1], baseColor);
    numVertTrafficCone += 6;

    Quad(baseVertices[1], baseVertices[5], baseVertices[6], baseVertices[2], baseColor);
    numVertTrafficCone += 6;

    Quad(baseVertices[2], baseVertices[6], baseVertices[7], baseVertices[3], baseColor);
    numVertTrafficCone += 6;

    Quad(baseVertices[3], baseVertices[7], baseVertices[4], baseVertices[0], baseColor);
    numVertTrafficCone += 6;
}

const Quad = (a, b, c, d, color) => {
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
}

const RenderTrafficCone = () => {
    gl.drawArrays(gl.TRIANGLES, 0, numVertTrafficCone);
}