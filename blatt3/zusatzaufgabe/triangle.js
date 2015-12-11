var gl;
var ringBrightness = 1.0;
var ringRadius = 70.0;
var ringWidth = 20;
var program;
var canvas

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
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

	program = initShaders(gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);
	
	
	
	gl.uniform1f(gl.getUniformLocation(program, "canvasWidth"), canvas.width);
    gl.uniform1f(gl.getUniformLocation(program, "canvasHeight"), canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, "ringRadius"), ringRadius);
    gl.uniform1f(gl.getUniformLocation(program, "ringWidth"), ringWidth);
    gl.uniform1f(gl.getUniformLocation(program, "ringBrightness"), ringBrightness);
	
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
    window.addEventListener("keydown", manipulateRing);
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	window.requestAnimationFrame(render);
};
        



function manipulateRing(e)
{
        switch (e.keyCode)
        {
            case 38: 
                        if(ringBrightness<2.0)
                        {
                            ringBrightness += 0.1;
                            gl.uniform1f(gl.getUniformLocation(program, "ringBrightness"), ringBrightness);
                        }
                        break;
            case 40: 
                        if(ringBrightness>1.0)
                        {
                            ringBrightness -= 0.1;
                            gl.uniform1f(gl.getUniformLocation(program, "ringBrightness"), ringBrightness);
                        }
                        break;
            case 39: 
                        if(ringRadius + ringWidth + 5.0 < Math.min(canvas.width, canvas.height)/2)
                        {
                            ringRadius += 5.0;
                            gl.uniform1f(gl.getUniformLocation(program, "ringRadius"), ringRadius);
                        }
                        break;
            case 37: 
                        if((ringRadius > 10))
                        {
                            ringRadius -= 5.0;
                            gl.uniform1f(gl.getUniformLocation(program, "ringRadius"), ringRadius);
                        }
        }
        
};

