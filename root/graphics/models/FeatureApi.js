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
    renderFunction: null,

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

    init: function (targetElement, renderFunction) {
        this.targetElement = targetElement;
        this.renderFunction = renderFunction;

        this._RegisterEvents();
    },

    _RegisterEvents: function () {
        document.getElementById('gl-canvas').addEventListener("mousedown", function (e) {
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

            Render(renderFunction);
        });

        document.getElementById('gl-canvas').addEventListener("mouseup", function (e) {
            MouseManipulation.mouseDownLeft = false;
            MouseManipulation.mouseDownRight = false;
            Render(renderFunction);
        });

        document.getElementById('gl-canvas').addEventListener("mousemove", function (e) {
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

            Render(renderFunction);
        });
    }
};

