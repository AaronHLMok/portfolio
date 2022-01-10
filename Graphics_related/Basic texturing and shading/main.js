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

var modelMatrix, viewMatrix ;
var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
//var eye = vec3(5, 2, 10);
//var at = vec3(2.0, 0.0, -10.0);

var eye = vec3(3,1,10);
var at = vec3(0,0,0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0 ;
var RY = 0 ;
var RZ = 0 ;

var MS = [] ; // The modeling matrix stack
var TIME = 0.0 ; // Realtime
var TIME = 0.0 ; // Realtime
var resetTimerFlag = true ;
var animFlag = false ;
var prevTime = 0.0 ;
var useTextures = 1 ;


/*variables to position camera, and using time for doing animations at certain time*/
var then = new Date().getTime();
var track_position = -10;
var launch_time;
var track_time;
var curr_time;
var yplant = 0;
var i = 0;
var timepassed = 0;
var frames = 0;
var aniflag = 0;
var yPoyoyo = 0;


// ------------ Images for textures stuff --------------
var texSize = 64;

var image1 = new Array()
for (var i =0; i<texSize; i++)  image1[i] = new Array();
for (var i =0; i<texSize; i++)
for ( var j = 0; j < texSize; j++)
image1[i][j] = new Float32Array(4);
for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
    var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
    image1[i][j] = [c, c, c, 1];
}

// Convert floats to ubytes for texture

var image2 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ )
for ( var j = 0; j < texSize; j++ )
for(var k =0; k<4; k++)
image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];


var textureArray = [] ;

function isLoaded(im) {
    if (im.complete) {
        console.log("loaded") ;
        return true ;
    }
    else {
        console.log("still not loaded!!!!") ;
        return false ;
    }
}

function loadFileTexture(tex, filename)
{
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    tex.image.src = filename ;
    tex.isTextureReady = false ;
    tex.image.onload = function() { handleTextureLoaded(tex); }
    // The image is going to be loaded asyncronously (lazy) which could be
    // after the program continues to the next functions. OUCH!
}

function loadImageTexture(tex, image) {
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    //tex.image.src = "CheckerBoard-from-Memory" ;

    gl.enable( gl.BLEND );
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    
    gl.bindTexture( gl.TEXTURE_2D, tex.textureWebGL );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
                  gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);

    tex.isTextureReady = true ;

}

/*whole bunch of images*/
function initTextures() {

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"bow.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"mouth.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"red.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"black.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"yellow.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"white.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"grass.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"sky.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"rocks.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"house.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"cactus.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"noise.png") ;
}

function handleTextureLoaded(textureObj) {
    gl.enable( gl.BLEND );
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    
    textureObj.isTextureReady = true ;
}

//----------------------------------------------------------------

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

function toggleTextures() {
    useTextures = 1 - useTextures ;
    gl.uniform1i( gl.getUniformLocation(program,
                                         "useTextures"), useTextures );
}

function waitForTextures1(tex) {
    setTimeout( function() {
    console.log("Waiting for: "+ tex.image.src) ;
    wtime = (new Date()).getTime() ;
    if( !tex.isTextureReady )
    {
        console.log(wtime + " not ready yet") ;
        waitForTextures1(tex) ;
    }
    else
    {
        console.log("ready to render") ;
        window.requestAnimFrame(render);
    }
               },5) ;
    
}

// Takes an array of textures and calls render if the textures are created
function waitForTextures(texs) {
    setTimeout( function() {
               var n = 0 ;
               for ( var i = 0 ; i < texs.length ; i++ )
               {
                    console.log("boo"+texs[i].image.src) ;
                    n = n+texs[i].isTextureReady ;
               }
               wtime = (new Date()).getTime() ;
               if( n != texs.length )
               {
               console.log(wtime + " not ready yet") ;
               waitForTextures(texs) ;
               }
               else
               {
               console.log("ready to render") ;
               window.requestAnimFrame(render);
               }
               },5) ;
    
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);


    //Load shaders and initialize attribute buffers
    initshaderA();

    // set a default material
    setColor(materialDiffuse) ;
    
    // set the callbacks for the UI elements
    document.getElementById("sliderXi").oninput = function() {
        RX = this.value ;
        window.requestAnimFrame(render);
    };
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
    };
    
    document.getElementById("textureToggleButton").onclick = function() {
        toggleTextures() ;
        window.requestAnimFrame(render);
    };

    var controller = new CameraController(canvas);
    controller.onchange = function(xRot,yRot) {
        RX = xRot ;
        RY = yRot ;
        window.requestAnimFrame(render); };
    
    // load and initialize the textures
    initTextures() ;
    //myShader();
    
    // Recursive wait for the textures to load
    waitForTextures(textureArray) ;
    //setTimeout (render, 100) ;
    
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
// and replaces the modelview matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z])) ;
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modelview matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z])) ;
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modelview matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz)) ;
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop() ;
}

// pushes the current modelMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix) ;
}

/*failed attempt to make shader*/
function myShader(){
    /*loading up with my shader*/
    programB = initShaders(gl, "vertex-shader", "myFrag");
    /*use said shader*/
    gl.useProgram( programB );
    /*only using spheres for this*/
    Sphere.init(36,programB);

    gl.uniform1i( gl.getUniformLocation(programB, "useTextures"), useTextures );
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
}

/*I tried to do something but failed horribly. This is no different than the base code, just
* stuffed into a function.*/
function initshaderA(){
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load canonical objects and their attributes
    Cube.init(program);
    Cylinder.init(9,program);
    Cone.init(9,program) ;
    Sphere.init(36,program) ;

    gl.uniform1i( gl.getUniformLocation(program, "useTextures"), useTextures );

    // record the locations of the matrices that are used in the shaders
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
}

/*Below are multiple draw functions split up for easier read/use*/
function drawGround() {
    gPush();
    setT(6);
    gTranslate(0,-6,0);
    gScale(50,0.75,50);
    drawCube();
    gPop();
}

function drawBell(){
    gPush();
    setT(4);
    gRotate(-30,0,0,1);
    setColor(vec4(1,1,0));
    gScale(0.3,0.3,0.3);
    gTranslate(-4.5,-0.5,2.3);
    drawSphere();
    gTranslate(0.5,-1,0.7);
    gRotate(70,1,0,0);
    setColor(vec4(1,0,0));
    gPush();
    gScale(0.5,0.5,3);
    setT(2);
    drawCylinder();
    gPop();
    gTranslate(0,-1,0);
    gRotate(30,1,0,0);
    gScale(0.5,0.5,4);
    drawCylinder();
    gPop();
}

function drawHorn(){
    gPush();
    setT(5);
    setColor(vec4(1.0,1.0,1.0));
    gScale(0.7,0.7,7);
    drawCone();
    gPop()

}

function drawLeg(){
    gPush();
    {
        setColor(vec4(1.0,1.0,1.0,1.0)) ;
        gScale(0.2,1,0.2);
        gRotate(90,1,0,0) ;
        drawCylinder() ;
        gScale(0.5,0.5,0.5);
        gTranslate(0,0,1.5);
        drawCone();
    }
    gPop();
}

/*Main attraction. I hand drew the texture of the body haha*/
function drawPoyoyo(){
    gPush();
    {
        /*Draw bells*/
        gPush();
        drawBell();
        gRotate(180,0,1,0);
        gTranslate(0,0,-1.3);
        drawBell();
        gPop();

        /*eyes*/
        gPush();
        setT(3);
        gScale(0.22,0.22,0.1);
        gTranslate(-2,1.3,14);
        setColor(vec4(0.0,0.0,0.0,0.0));
        drawSphere();
        gPush();
        gRotate(-30,0,1,0,);
        gTranslate(0,1,0.5);
        gScale(2,0.2,0.1);
        drawCube();
        gPop();
        gTranslate(4,0,0);
        drawSphere();
        gPush();
        gRotate(30,0,1,0,);
        gTranslate(0,1,0.5);
        gScale(2,0.2,0.1);
        drawCube();
        gPop();

        /*draw horns the finer details (red and black rings around the horns are not functions*/
        gPush();
        gRotate(-50,1,0,0);
        gTranslate(-4.7,4.5,2.5);
        gPush();
        setT(2);
        setColor(vec4(1.0,0,0));
        gTranslate(0,0,-2);
        gScale(1.2,1.2,0.35);
        drawCylinder();
        gTranslate(0,0,3);
        gScale(0.8,0.8,1);
        drawCylinder();
        gPop();
        drawHorn();
        gTranslate(5,0,0);
        drawHorn();
        gTranslate(0,0,-3);
        gScale(1.4,1.4,1.4);
        setColor(vec4(0,0,0));
        setT(3);
        drawCylinder();
        gPop();
        gPop();

        /*body*/
        setT(1);
        gScale(1.2,1.1,1.5);
        setColor(vec4(1.0,1.0,1.0,1.0)) ;
        drawSphere();

        /*Front legs*/
        var leggies = 0;
        if (track_position < 23 || track_time > 36) {
            leggies = 15 * Math.cos(TIME * 2);
        }
        setT(5);
        gPush();
        gRotate(leggies,1,0,0);
        gTranslate(-0.6, -0.35, 0.5);
        drawLeg();
        gTranslate(1.2,0,0);
        drawLeg();
        gPop();

        /*Back legs*/
        gPush();
        gRotate(-leggies,1,0,0);
        gTranslate(-0.6, -0.35, -0.5);
        drawLeg();
        gTranslate(1.2,0,0);
        drawLeg();
        gPop();

        /*bow map texture*/
        gPush();
        setT(0);
        gRotate(20,1,0,0);
        gTranslate(0,0,-1);
        gPush();
        gScale(0.5,0.5,0.1);
        gTranslate(1,0,0);
        drawSphere();
        gTranslate(-2,0,0);
        drawSphere();
        gPop();
        gTranslate(0.5,-1,0);
        gPush();
        gRotate(30,0,0,1);
        gScale(0.1,1,0.025);
        drawCube();
        gPop();
        gTranslate(-1,0,0);
        gRotate(-30,0,0,1);
        gScale(0.1,1,0.025);
        drawCube();
        gPop();
    }
    gPop();

}

function drawMountains(){
    gPush();
    setT(8);
    gTranslate(-20,0,-20);
    gPush();
    gRotate(-90,1,0,0);
    gScale(5,5,10);
    drawCone();
    gPop();
    gTranslate(-7,-2,5);
    gRotate(-90,1,0,0);
    gScale(3.5,3.5,7);
    drawCone();
    gPop();
}

function drawRocks(){
    toggleTextures();
    gPush();
    setColor(vec4(1.0,0.0,0.0,1.0));
    gPush();
    gTranslate(25,-5.5,-10);
    drawSphere();
    gTranslate(-2,0,5);
    drawSphere();
    gTranslate(-2,0,6);
    drawSphere();
    gPop()

    gTranslate(-20,-5.5,10);
    drawSphere();
    gTranslate(7,0,-5);
    drawSphere();
    gTranslate(3,0,-7);
    drawSphere();
    gPop();
    toggleTextures();
}

function drawPath(){
    gPush();
    setT(8);
    gTranslate(0,-1.2,0);
    gScale(1,0.05,70);
    drawCube();
    gPop();
}

function drawHouse(){
    gPush();
    setT(9);
    gTranslate(50,1.5, 30);
    gScale(0.1,7,7);
    drawCube();
    gPop();
}

function drawWeirdPlant(){
    gPush();
    setT(10);
    gTranslate(-1,-3.2,23);
    var zplant = 0.25*Math.cos(TIME + 3.14592);

    {
        if (track_time > 25){
            gTranslate(0, yplant, 0);
            yplant += 1/70;
        }
        gPush();
        toggleTextures();
        setColor(vec4(1.0,0.65,0.0));
        gTranslate(0,-3,0);
        gScale(0.5,1,0.5);
        drawSphere();
        toggleTextures();
        gPop();

        gPush();
        gTranslate(0,-1,0);
        gScale(0.5,1.5,0.5);
        drawCube();
        gPop();

        gPush();
        gTranslate(0,1, zplant);
        drawPlantArms();
        gScale(0.5,0.5,0.5);
        drawCube();
        gPop();

        gPush();
        gTranslate(0,2, -zplant);
        gScale(0.5,0.5,0.5);
        drawCube();
        gPop();
    }
    gPop();
}

/*arms are drawn in order: body to elbow, elbow to outer arm*/
function drawPlantArms(){
    var rotate = Math.cos(TIME);
    gPush();
    {
        gTranslate(0,0,1);
        gPush();
        gScale(0.2,0.2,1);
        drawCube()
        gPop();

        gTranslate(0,0,1.2);
        gRotate(24*rotate,1,0,0);
        gPush();
        gScale(0.3,0.3,0.3);
        drawSphere();
        gPop();
        gRotate(-(360*rotate),0,0,1);
        gTranslate(0,0.8,0);
        gScale(0.2,1,0.2);
        drawCube();
        gPop();

        gPush();
        gTranslate(0,0,-1);
        gPush();
        gScale(0.2,0.2,1);
        drawCube();
        gPop();

        gTranslate(0,0,-1.2);
        gRotate(-(24*rotate),1,0,0);
        gPush();
        gScale(0.3,0.3,0.3);
        drawSphere();
        gPop();
        gRotate(360*rotate,0,0,1);
        gTranslate(0,-0.8,0);
        gScale(0.2,1,0.2);
        drawCube();
    }
    gPop();

}

/*Functions for specific camera movements*/
function rotateCamera(){
        eye[0] = eye[0] * Math.cos(1 / 100) + eye[2] * Math.sin(1 / 100);
        eye[2] = -eye[0] * Math.sin(1 / 100) + eye[2] * Math.cos(1 / 100);
        viewMatrix = lookAt(eye, at, up);
}

function followCamera(){
    eye[2] = track_position + 10;
    at[2] = track_position;
    viewMatrix = lookAt(eye, at, up);
}

/*used to time animations, when to spin camera, when to move/stop etc*/
function calcTime(){
    curr_time = new Date().getTime();
    track_time = (curr_time - launch_time) / 1000;
    console.log(track_time);
}

/*For easier texture application
 *think of these as 'layers' up to 8. first line indicates layer 0 *
 *second line says use this texture from texture array as layer 0
 *3rd line ties it up. Basically if I just want one texture for each obj,
 *I can change line 2. Draw anything w/o textures above these*/
function setT(num){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[num].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
}

/*Time is used here to determine movement of animation and other aspects
 *Track position is also used in the animation process and camera location with respect to
 *Poyoyo */
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the projection matrix
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    viewMatrix = lookAt(eye, at, up);

    // initialize the modeling matrix stack
    MS= [] ;
    modelMatrix = mat4() ;

    // apply the slider rotations
    gRotate(RZ,0,0,1) ;
    gRotate(RY,0,1,0) ;
    gRotate(RX,1,0,0) ;

    // send all the matrices to the shaders
    setAllMatrices() ;

    // get real time
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

    /*the 'box' this world exists in*/
    gPush();
    setT(7);
    gScale(50,50,50);
    drawCube();
    gPop();

    /*Draw scene*/
    calcTime();
    gPush() ;
    {
        drawGround();
        drawMountains();
        drawRocks();
        drawHouse();
        drawWeirdPlant();

        gPush();
        gTranslate(2,-4,-10);
        drawPath();
        gPop();

        gTranslate(2,-4,0);
        gPush();
        gScale(0.75,0.75,0.75);
        if (track_position < 23){
            track_position += 1/10;
            followCamera();
        }
        gTranslate(0,0,track_position);
        if (track_time > 35.5){
            gTranslate(0,yPoyoyo,0);
            yPoyoyo += 1/60;
        }
        drawPoyoyo();
        if(track_time > 10 && track_time < 20){
            rotateCamera();
        }
        gPop();
        console.log(track_time);
    }
    gPop();
    frames++;

    if( animFlag ) {
        if (aniflag == 0){
            launch_time = new Date().getTime();
            aniflag++;
        }
        window.requestAnimFrame(render);
        fps();
    }

}

/*I divided by two because we wanted to display the fps one every two seconds*/
function fps() {
    var now = new Date().getTime();
    timepassed += (now - then);
    then = now;

    if (timepassed >= 2000){
        const fps = document.querySelector("#fps");
        fps.textContent = Math.floor(frames/2);
        frames = 0;
        timepassed = 0;
    }
}

// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere
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
