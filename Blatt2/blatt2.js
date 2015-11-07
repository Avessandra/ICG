var gl;

var eckpunkt_x;
var eckpunkt_y;
var zeichnen = false;
var color_state = 1;

window.onload = function init()
{
    window.addEventListener("keydown", aendereFarbe);
	// Get canvas and setup webGL
	
    var canvas = document.getElementById("gl-canvas");


    
    gl = WebGLUtils.setupWebGL(canvas);

    //canvas.onmousedown = merkeEckpunkte();
    //canvas.onmousemove = reagiereAufMouseMove();
    //canvas.onmouseup = lasseMausLos();

    canvas.addEventListener("mousedown", merkeEckpunkte);
    canvas.addEventListener("mousemove", reagiereAufMouseMove);
    canvas.addEventListener("mouseup", lasseMausLos);

	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	
	



	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);
	//zeichneViereck();
	
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function aendereFarbe(e)
{
    console.log(e.keyCode);
    if (e.keyCode==66)
    {
        color_state = 1;
    }
    else if (e.keyCode==82)
    {
        color_state = 2;
    }

    else if (e.keyCode == 71) {
        color_state = 3;
    }
}

function doSomething(e)
{
    var x_koordinate = e.clientX;
    var y_koordinate =512- e.clientY;
    
    console.log("X: " + x_koordinate);
    console.log("Y: " + y_koordinate);

    var x_koordinate_normed = normValue(x_koordinate, 0, 512, -1, 1);
    console.log("X normed: "+  x_koordinate_normed);
    var y_koordinate_normed = normValue(y_koordinate, 0, 512, -1, 1);
    console.log("Y normed: " + y_koordinate_normed);

}

function merkeEckpunkte(e)
{
    zeichnen = true;
    var x_koordinate = e.clientX;
    var y_koordinate = 512 - e.clientY;

    eckpunkt_x = normValue(x_koordinate, 0, 512, -1, 1);
    eckpunkt_y = normValue(y_koordinate, 0, 512, -1, 1);

    console.log("eckpunkt " + eckpunkt_x);

}

function reagiereAufMouseMove(e)
{
    //console.log("X " + e.clientX);
    if (zeichnen == true)
    {
        var x_koordinate = e.clientX;
        var y_koordinate = 512 - e.clientY;

        x_koordinate = normValue(x_koordinate, 0, 512, -1, 1);
        y_koordinate = normValue(y_koordinate, 0, 512, -1, 1);

        zeichneViereck(eckpunkt_x, eckpunkt_y, x_koordinate, y_koordinate);

    }

}

function lasseMausLos(e)
{

    var x_koordinate = e.clientX;
    var y_koordinate = 512 - e.clientY;
    zeichnen = false;

    x_koordinate = normValue(x_koordinate, 0, 512, -1, 1);
    y_koordinate = normValue(y_koordinate, 0, 512, -1, 1);
    zeichneViereck(eckpunkt_x, eckpunkt_y, x_koordinate, y_koordinate);


}

function normValue(value,valueMin,valueMax,resultMin,resultMax)
{
    return (((value-valueMin)*(resultMax-resultMin))/valueMax-valueMin)+resultMin;
}



function zeichneViereck(x,y,xn,yn) {
    var vertices = new Float32Array([x, y,
										x, yn,
										xn, yn,
	                                  x, y,
										xn, y,
										xn, yn]);

    if (color_state == 1)
    {
        var colors = new Float32Array([0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
                                    0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
        ]);
    }
    else if (color_state == 2)
    {
        var colors = new Float32Array([1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
                                    1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
        ]);

    }
    else if (color_state == 3)
    {
        var colors = new Float32Array([0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
                                    0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
        ]);
    }
    // Init shader program and bind it

    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    // Load colors into the GPU and associate shader variables

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);


    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);




    // Load positions into the GPU and associate shader variables

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);



    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);




    var vPosition2 = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);
    render();


}
