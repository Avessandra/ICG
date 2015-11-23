var gl;
var abstand;
var program;
var rw;
window.onload = function init()
{
	// Get canvas and setup webGL
	
    var canvas = document.getElementById("gl-canvas");
    window.addEventListener("keydown", transformiere);
	gl = WebGLUtils.setupWebGL(canvas);


	if (!gl) { alert("WebGL isn't available"); }

	


	// Specify position and color of the vertices
	
	var r = 0.2;
	var w = Math.PI / 8;

	var vertices = new Float32Array([
        0.0, 0.0,
        Math.cos(w) * r, Math.sin(w) * r*(-1),
        Math.sin(w) * r, Math.cos(w) * r* (-1),
        Math.sin(w) * r * (-1), Math.cos(w) * r*(-1),
        Math.cos(w) * r * (-1), Math.sin(w) * r*(-1),
        Math.cos(w) * r * (-1), Math.sin(w) * r,
        Math.sin(w) * r * (-1), Math.cos(w) * r,
        Math.sin(w) * r, Math.cos(w) * r,
        Math.cos(w) * r, Math.sin(w) * r,
        
	]);

	var colors = new Float32Array([1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
	                                1, 1, 0, 1,
	                                1, 1, 0, 1,
	                                1, 1, 0, 1,
	                                1, 1, 0, 1,
	                                1, 1, 0, 1,
	                                1, 1, 0, 1
                                   ]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
    
	
	void gl.uniform1f(gl.getUniformLocation(program, "bildschirmbreite"), canvas.width);

	mitte = canvas.width / 2.0;
	void gl.uniform1f(gl.getUniformLocation(program, "mitte_x"), mitte);
	abstand = 100.0;
	void gl.uniform1f(gl.getUniformLocation(program, "abstand"), abstand);

	var rw = 0;
	var rotationMatrix = new Float32Array([Math.cos(rw), Math.sin(rw), 0, 0,
											Math.sin(rw) * (-1), Math.cos(rw), 0, 0,
											0, 0, 1, 0,
											0, 0, 0, 1]);

	gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotationMatrix"),false, rotationMatrix);








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
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 9);
	//window.requestAnimationFrame(render);
}

function doSomething()
{


    console.log("Registriert");
    
    abstand += 5;
    if (abstand > 206)  abstand = 206;

    void gl.uniform1f(gl.getUniformLocation(program, "abstand"), abstand);
    console.log("Registriert");
    
    render();
}

function transformiere(e)
{
    //console.log(e.keyCode);

    if (e.keyCode==37)
    {
        rw = Math.PI;       
    }
    if (e.keyCode == 39)
    {
        rw = 0;
    }
    if (e.keyCode == 38)
    {
        rw = (Math.PI / 2);
    }
    if (e.keyCode == 40)
    {
        rw = ((Math.PI*3) / 2);
    }
    var rotationMatrix = new Float32Array([Math.cos(rw), Math.sin(rw), 0, 0,
											Math.sin(rw) * (-1), Math.cos(rw), 0, 0,
											0, 0, 1, 0,
											0, 0, 0, 1]);
    //console.log("transformiert");
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotationMatrix"), false, rotationMatrix);
    render();
}

