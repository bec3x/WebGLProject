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

const Triangle = (a, b, c, color) => {
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
}

const hexToDecimal = hex => parseInt(hex, 16);

const HexToColorVector = (hexVal) => {
    if (typeof hexVal !== 'string' || hexVal.length != 7) return;
    vals = [];
    rgbVals = [];

    strippedHex = hexVal.substring(1, 7);
    
    for (var i = 0, j = 0; i < 3; i++, j += 2) {
        vals.push(strippedHex.substring(j, j + 2));
    }

    vals.forEach((hex) => {
        rgbVals.push(hexToDecimal(hex) / 255);
    });

    return vec4(rgbVals[0], rgbVals[1], rgbVals[2], 1.0);
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}