var gl;
var canvas;

var vertices;
var colors;

var colorBuffer;
var positionBuffer;

var modelMatrixLoc;
var modelMatrix;

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	// Specify position and color of the vertices
	
										// Front
	vertices = new Float32Array([		-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, 0.5, 0.5,
										
										0.5, 0.5, 0.5,
										-0.5, 0.5 ,0.5,
										-0.5, -0.5, 0.5,
										
										// Right
										0.5, 0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										0.5, 0.5, 0.5,
										
										// Back
										-0.5, -0.5, -0.5,
										0.5, -0.5, -0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 ,-0.5,
										-0.5, -0.5, -0.5,
										
										// Left
										-0.5, 0.5, 0.5,
										-0.5, -0.5, 0.5,
										-0.5, -0.5, -0.5,
										
										-0.5, -0.5, -0.5,
										-0.5, 0.5, -0.5,
										-0.5, 0.5, 0.5,
										
										// Bottom
										-0.5, -0.5, 0.5,
										0.5, -0.5, 0.5,
										0.5, -0.5, -0.5,
										
										0.5, -0.5, -0.5,
										-0.5, -0.5 , -0.5,
										-0.5, -0.5, 0.5,
										
										// Top
										-0.5, 0.5, 0.5,
										0.5, 0.5, 0.5,
										0.5, 0.5, -0.5,
										
										0.5, 0.5, -0.5,
										-0.5, 0.5 , -0.5,
										-0.5, 0.5, 0.5
										]);
										
									// Front
	colors = new Float32Array([ 1, 0, 0, 1, 
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									
									// Right
									0, 1, 0, 1, 
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									
									// Back
									0, 0, 1, 1, 
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									
									// Left
									1, 1, 0, 1, 
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									
									// Bottom
									1, 0, 1, 1, 
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									
									// Top
									0, 1, 1, 1, 
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1
									]);

	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
	
	// Load colors into the GPU and associate shader variables
	
	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	// Load positions into the GPU and associate shader variables

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	// Set and load modelMatrix
	
	modelMatrix = new Float32Array([	1,0,0,0,
											0,1,0,0,
											0,0,1,0,
											0,0,0,1]);
	
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
    
	//Set and load viewMatrix
	
	//up 0 1 0
	
	var viewMatrix = mat4.create();
	//vec3.fromValues(1,2,3)
	eye = new Float32Array([0.0,0.0,0.0]);
	up = new Float32Array([0.0,1.0,0.0]);
	look = new Float32Array([-1.0,-1.0,-1.0])
	
	mat4.lookAt(viewMatrix,eye,look,up);
	viewlMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
	
	
	
	//Set and load Projection Matrix
	
	mat4.perspective(outMatrix2,fieldOfView,aspectRatio,near,far);
	
	
	
	
	
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
	requestAnimFrame(render);
}


