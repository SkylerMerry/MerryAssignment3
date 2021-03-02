//author: Skyler Merry
//date: 3/1/2021
//description: This is a demonstration of 2 shaders. The button changes the direction of the
// square. The slider changes the speed of the square. The menu changes the location of the
// triangle. While the keyboard keys (W,A,S,D) also changes the location / size of the triangle
// to correspond with Up (W), Left (A), Down (S), and Right (D).
//proposed points (10 of 10): I completed each task - 2 colors, 2 shaders, button, slider, menu, keyboard
"use strict";

var canvas;
var gl;
var slider;

var theta = 0.0;
var thetaLoc;
var speed = 0.1;
var direction = true;

var vertices;
var verticesTriangle;
var program;
var programTriangle;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    vertices = [
        vec2(0, .5),
        vec2(-.5, 0),
        vec2(.5, 0),
        vec2(0, -.5)
    ];
    
    verticesTriangle = [
        vec2(.4, .4),
        vec2(0.6, .4),
        vec2(.5, 0.6)
    ];

    //Establish shaders and uniform variables
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader-still");

    //Slider to control speed
    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed);
    }

    //Button to control direction
    document.getElementById("Direction").onclick = function() {
        console.log("pressed button");
        direction = !direction;
    }

    //Menu to select where triangle is located
    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            case 0:
                verticesTriangle = [
                    vec2(.4, .4),
                    vec2(0.6, .4),
                    vec2(.5, 0.6)
                ];            
                break;
            case 1:
                verticesTriangle = [
                    vec2(-.4, -.4),
                    vec2(-0.6, -.4),
                    vec2(-.5, -0.6)
                ];
            
                
        }
    }

    //Keyboard commands to create big triangles
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'W': //Top
          case 'w':
            verticesTriangle = [
                vec2(0, 1),
                vec2(-.5, .5),
                vec2(.5, .5)
            ];
            break;
          case 'A': //Left
          case 'a':
            verticesTriangle = [
                vec2(-1, 0),
                vec2(-.5, -.5),
                vec2(-.5, .5)
            ];
            break;
          case 'S': //Bottom
          case 's':
            verticesTriangle = [
                vec2(0, -1),
                vec2(-.5, -.5),
                vec2(.5, -.5)
            ];
            break;
          case 'D': //Right
          case 'D':
            verticesTriangle = [
                vec2(1, 0),
                vec2(.5, .5),
                vec2(.5, -.5)
            ];
        }
    };


    render();
};




function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // DRAW THE SQUARE
    gl.useProgram(program);
   
    // Load the data 
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // rotation & direction
    if (direction == true) {
        theta += speed;
    }
    else {
        theta -= speed;
    }

    gl.uniform1f(thetaLoc, theta);
    // DRAW IT!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    



    // DRAW THE TRIANGLE
    // switch to the Triangle shaders
    gl.useProgram(programTriangle);
    
    // Load the data
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    // DRAW IT!
    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);




    requestAnimationFrame(render);
}
