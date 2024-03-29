
var canvas;
var gl;

var program ;

var near = 1;
var far = 100;


var left = -6.0;
var right = 6.0;
var ytop =6.0;
var bottom = -6.0;


var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0 );
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix, modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0 ;
var RY = 0 ;
var RZ = 0 ;

var MS = [] ; // The modeling matrix stack
var TIME = 0.0 ; // Realtime
var prevTime = 0.0 ;
var resetTimerFlag = true ;
var animFlag = false ;
var controller ;

function setColor(c)
{
    ambientProduct = mult(lightAmbient, c);
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    setColor(materialDiffuse) ;

    Cube.init(program);
    Cylinder.init(9,program);
    Cone.init(9,program) ;
    Sphere.init(36,program) ;

    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    
    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );

	
	document.getElementById("sliderXi").oninput = function() {
		RX = this.value ;
		window.requestAnimFrame(render);
	}
		
    
    document.getElementById("sliderYi").oninput = function() {
        RY = this.value;
        window.requestAnimFrame(render);
    };
    document.getElementById("sliderZi").oninput = function() {
        RZ =  this.value;
        window.requestAnimFrame(render);
    };

    document.getElementById("animToggleButton").onclick = function() {
        if( animFlag ) {
            animFlag = false;
        }
        else {
            animFlag = true  ;
            resetTimerFlag = true ;
            window.requestAnimFrame(render);
        }
        console.log(animFlag) ;
		
		controller = new CameraController(canvas);
		controller.onchange = function(xRot,yRot) {
			RX = xRot ;
			RY = yRot ;
			window.requestAnimFrame(render); };
    };

    render();
}

// Sets the modelview and normal matrix in the shaders
function setMV() {
    modelViewMatrix = mult(viewMatrix,modelMatrix) ;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix) ;
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    setMV() ;
    
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
function drawCube() {
    setMV() ;
    Cube.draw() ;
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawSphere() {
    setMV() ;
    Sphere.draw() ;
}
// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
function drawCylinder() {
    setMV() ;
    Cylinder.draw() ;
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawCone() {
    setMV() ;
    Cone.draw() ;
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modeling matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z])) ;
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modeling matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z])) ;
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modeling matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz)) ;
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop() ;
}

// pushes the current modelViewMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix) ;
}

/*Function for drawing seaweed. Entered the drawsphere() into a forloop to draw 10 times*/
function draw_seaweed(){
    var i = 0;
    var sea_rotate = 6*Math.cos(TIME*1.5 + 3.14592);

    gPush();
    for (i = 0; i < 10; i++){
        drawSphere();
        gTranslate(0, 2, 0);
        gRotate(sea_rotate,0,0,1);
    }
    gPop();
}

/*Draws two rocks and fish. The fish uses the origin point of the Big rock, and rotates around that.*/
function rock_n_fish(){
    gTranslate(3,-3.5,0);
    var yfish = 0.7*Math.cos(TIME*2);

    gPush();
    {
        gRotate(TIME*180/3.14592, 0,-1,0);
        gTranslate(2,yfish + 1,0);
        gPush();
        draw_fish_body();
        gPop();
        gTranslate(-0.3,0.2,-0.1);
        draw_eye();
        gTranslate(0.6,0,0);
        draw_eye();
    }
    gPop();

    setColor(vec4(1,1,1,0)) ;

    gScale(0.5, 0.5, 0.5);
    drawSphere() ;
    setColor(vec4(1.0,0.0,1.0,1.0)) ;
    gTranslate(-1.5,-0.5,0);
    gScale(0.5, 0.5, 0.5);
    drawSphere();
}

/*Draws the eyes of the fish, first the whites, and scale down the pupils and move it forward*/
function draw_eye(){
    gPush();
    gScale(0.2,0.2,0.2);
    setColor(vec4(1,1,1,1));
    drawSphere();
    gScale(0.6,0.6,0.6);
    gTranslate(0,0, 0.9);
    setColor(vec4(0,0,0,0));
    drawSphere();
    gPop();
}

/*Draws the fish body including fins. Rotations of the fins are included here as well.*/
function draw_fish_body(){
    var rfin = 24*Math.cos(TIME*10);

    /*fins*/
    gPush();
    gTranslate(0,-0.3,-2.7);
    gRotate(rfin,0,1,0);
    setColor(vec4(1,0,0,0));
    gRotate(135, 1, 0, 0);
    gPush();
    gScale(0.2,0.2,0.7);
    drawCone();
    gPop();
    gTranslate(0,-0.8,-0.4);
    gPush();
    gRotate(90, 1,0,0);
    gScale(0.2,0.2,1.5);
    drawCone();
    gPop();
    gPop();
    /*body*/
    setColor(vec4(0.9,0.3,0.7));
    gScale(0.7,0.7,0.7);
    drawCone();
    setColor(vec4(1,0,0));
    gTranslate(0,0,-2)
    gRotate(180,0,1,0);
    gScale(1,1,3);
    drawCone();
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(0,0,10);
    MS = [] ; // Initialize modeling matrix stack
	
	// initialize the modeling matrix to identity
    modelMatrix = mat4() ;
    
    // set the camera matrix
    viewMatrix = lookAt(eye, at , up);
   
    // set the projection matrix
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    // Rotations from the sliders
    gRotate(RZ,0,0,1) ;
    gRotate(RY,0,1,0) ;
    gRotate(RX,1,0,0) ;
    
    
    // set all the matrices
    setAllMatrices() ;
    
    var curTime ;
    if( animFlag )
    {
        curTime = (new Date()).getTime() /1000 ;
        if( resetTimerFlag ) {
            prevTime = curTime ;
            resetTimerFlag = false ;
        }
        TIME = TIME + curTime - prevTime ;
        prevTime = curTime ;
    }

    gTranslate(-4,0,0) ;

    /*Drawing two rocks and fish. I combined them both to make use of rocks origin point and rotate
    * the fish around that.
    * */
    gPush() ;
    {
        rock_n_fish();
    }
    gPop() ;

    gPush();
    {
        gTranslate(6,0,0);
        gRotate(45,1,0,0);

        drawCube();
    }
    gPop();

    /*Drawing seaweed, points were found through trial and error haha...
    * Could have used the same method as positioning the fish by using first rock as origin.*/
    gPush();
    {
        setColor(vec4(0,1,0,0));
        gTranslate(3,-2.8,0);
        gScale(0.1,0.2,0.1);
        draw_seaweed();
        gTranslate(-4.5,-3.0,0);
        draw_seaweed();
        gTranslate(10,0,0);
        draw_seaweed();
    }
    gPop();

    /*Drawing platform, black square*/
    gPush() ;
    {
        gTranslate(4,-5,0);
        setColor(vec4(0,0,0,0)) ;
        gScale(6,1,3);
        drawCube() ;
    }
    gPop() ;

    /*Drawing Human from head to toe. Diagonal motion should be applied to everything, and feet having a different
     *motion. Legs are drawn as two long sticks with a flat rectangle. Rotation occurs at hip and knee
     *Roation variables are declared at the top to be used later.
     * */

    gPush();
    {
        var yhuman = 0.5*Math.cos(TIME + 3.14592);
        var xhuman = 0.5*Math.sin(TIME + 3.14592/2);
        var leg_rotate = 12*Math.cos(TIME + 3.14592);
        gTranslate(xhuman, -yhuman, 0);

        gTranslate(8, 1, 0);
        setColor(vec4(1.0, 0.5, 0, 1.0));
        gScale(0.25, 0.25, 0.25);
        drawSphere();
        gTranslate(0, -4, 0);
        gScale(2, 3, 1);
        gRotate(-15, 0, 1, 0);
        drawCube();

        /*Left leg
        * Rotation at hip is at the very top and rotation at the knee is after translating for that
        * point of rotation. Same with right leg.
        * */
        gPush();
        {
            gRotate(leg_rotate, 1 ,0,0) ;

            gTranslate(-0.5, -1, -0.25);
            gRotate(40, 1, 0, 0);
            gTranslate(0, -0.5, 0.25);
            gScale(0.2, 0.5, 0.25);
            drawCube();

            gRotate(leg_rotate/2, 1, 0, 0);

            gTranslate(0, -1, -1);
            gRotate(60, 1, 0, 0);
            gPush();
            gScale(1, 3, 0.5);
            gTranslate(0, -1, 1);
            drawCube();
            gPop();
            gTranslate(0, -6, 1);
            gScale(1.2, 0.2, 1);
            drawCube();
        }
        gPop();

        /*Right leg*/
        gPush();
        {

            gRotate(-leg_rotate, 1 ,0,0) ;
            gTranslate(0.5, -1, -0.25);
            gRotate(40, 1, 0, 0);
            gTranslate(0, -0.5, 0.25);
            gScale(0.2, 0.5, 0.25);
            drawCube();

            gRotate(-leg_rotate/2, 1, 0, 0);

            gTranslate(0, -1, -1);
            gRotate(60, 1, 0, 0);
            gPush();
            gScale(1, 3, 0.5);
            gTranslate(0, -1, 1);
            drawCube();
            gPop();
            gTranslate(0, -6, 1);
            gScale(1.2, 0.2, 1);
            drawCube();
        }
        gPop();
    }
    gPop();
    
    if( animFlag )
        window.requestAnimFrame(render);
}

// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere.
function CameraController(element) {
	var controller = this;
	this.onchange = null;
	this.xRot = 0;
	this.yRot = 0;
	this.scaleFactor = 3.0;
	this.dragging = false;
	this.curX = 0;
	this.curY = 0;
	
	// Assign a mouse down handler to the HTML element.
	element.onmousedown = function(ev) {
		controller.dragging = true;
		controller.curX = ev.clientX;
		controller.curY = ev.clientY;
	};
	
	// Assign a mouse up handler to the HTML element.
	element.onmouseup = function(ev) {
		controller.dragging = false;
	};
	
	// Assign a mouse move handler to the HTML element.
	element.onmousemove = function(ev) {
		if (controller.dragging) {
			// Determine how far we have moved since the last mouse move
			// event.
			var curX = ev.clientX;
			var curY = ev.clientY;
			var deltaX = (controller.curX - curX) / controller.scaleFactor;
			var deltaY = (controller.curY - curY) / controller.scaleFactor;
			controller.curX = curX;
			controller.curY = curY;
			// Update the X and Y rotation angles based on the mouse motion.
			controller.yRot = (controller.yRot + deltaX) % 360;
			controller.xRot = (controller.xRot + deltaY);
			// Clamp the X rotation to prevent the camera from going upside
			// down.
			if (controller.xRot < -90) {
				controller.xRot = -90;
			} else if (controller.xRot > 90) {
				controller.xRot = 90;
			}
			// Send the onchange event to any listener.
			if (controller.onchange != null) {
				controller.onchange(controller.xRot, controller.yRot);
			}
		}
	};
}
