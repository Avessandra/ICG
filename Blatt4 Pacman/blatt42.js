var gl;
var abstand;
var program;
var rw = 0;
var tx;
var ty;
var x = 0;
var y = 0;
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
	rw =  0;
	tx = 0;
	ty = 0;
	var rotationMatrix = new Float32Array([Math.cos(rw), Math.sin(rw), 0, 0,
											Math.sin(rw) * (-1), Math.cos(rw), 0, 0,
											0, 0, 1, 0,
											0, 0, 0, 1]);

	gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotationMatrix"), false, rotationMatrix);

	var translationMatrix = new Float32Array([1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                            0, 0, 0, 1]);

	gl.uniformMatrix4fv(gl.getUniformLocation(program, "translationMatrix"), false, translationMatrix);








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
	window.requestAnimationFrame(render);
}


function transformiere(e)
{
   // console.log(e.keyCode);
    
    switch(e.keyCode)
    {
            case 37:
    
              
                     rw += 3.14159265359 / 180.0;
                    
            break;
            
            case 39:
            
             
                    rw -= 3.14159265359 / 180;
                     
            break;
            
            case 38:
                var deltaX =  - 0.05 * Math.sin(rw);   
                var deltaY = 0.05 * Math.cos(rw);
                tx += deltaX;
                ty += deltaY;
                if(!((tx > -1 + 0.2)&&(tx < 1 - 0.2)))
                {
                    tx -= deltaX;
                }
            
                if(!((ty > -1 + 0.2)&&(ty < 1 - 0.2)))
                {
                    ty -= deltaY;
                }
            
            break;
            
            default:
            return;
    }
                
    
    var translationMatrix = new Float32Array([1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                          tx , ty , 0, 1]);           

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "translationMatrix"), false, translationMatrix);

    var rotationMatrix = new Float32Array([Math.sin(rw) * (-1), Math.cos(rw), 0, 0,
                                        Math.cos(rw), Math.sin(rw), 0, 0,                                  
                                        0, 0, 1, 0,
                                        0, 0, 0, 1]);
    
    var originMatrix = new Float32Array([1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                          tx * Math.sin(rw) - ty * Math.sin(rw),tx * Math.sin(rw) + ty * Math.cos(rw), 0, 1]); 
    
    var originMatrixOut = new Float32Array([1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                          -tx * Math.sin(rw) - ty * Math.sin(rw),-tx * Math.sin(rw) + ty * Math.cos(rw), 0, 1]);   
    
    //console.log(tx + " / " + ty);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "rotationMatrix"), false, rotationMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "originMatrix"), false, originMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "originMatrixOut"), false, originMatrixOut);

    
}
