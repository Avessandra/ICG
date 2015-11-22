var gl;

window.onload = function init()
{
	// Get canvas and setup webGL
	
	var canvas = document.getElementById("gl-canvas");
	canvas.addEventListener("click", react2Mouseclick);
	document.addEventListener("keyup", react2Key);
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	
	var vertices = new Float32Array([	-1, 1, 
										1, 1,
										1, -1,
										-1, -1,
										]);
	var colors = new Float32Array([ 0, 0, 1, 0.8, 
									0, 0, 1, 0.8,
									0, 0, 1, 0.8,
									0, 0, 1, 0.5, 
									0, 0, 1, 0.5,
									0, 0, 1, 0.5,]);
									
	var mixed = new Float32Array([		
										0, 0, 1, 1, 		
										1, 0, 0, 1,
										1, 1, 0, 1,
										0, 1, 0, 1,       
										0, 0, 1, 0.5,
										0, 0, 1, 0.5,
										-1, 1, 
										1, 1,
										1, -1,
										-1, -1,]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
	
	
	
	gl.uniform1f(gl.getUniformLocation(program, "canvasWidth"), canvas.width);
	
	// Load colors into the GPU and associate shader variables
	
	var cBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, mixed, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	// Load positions into the GPU and associate shader variables

	//var bufferId = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	//gl.bufferData(gl.ARRAY_BUFFER, mixed, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 96);
	gl.enableVertexAttribArray(vPosition);
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	window.requestAnimationFrame(render);
};

function react2Key()
{	
	console.log("NEIN");
};

function react2Mouseclick()
{
	
	console.log("maus wurde geklickt");
}

