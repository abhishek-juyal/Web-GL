"use strict";

var canvas;
var gl;
var rotateX=false;
var rotateY=false;
var rotateZ=false;
function magicX(){
  if(rotateX ==false){
    rotateX = true;
  }else{
    rotateX = false;
  }
}
function magicY(){
  if(rotateY ==false){
    rotateY = true;
  }else{
    rotateY = false;
  }
}
function magicZ(){
  if(rotateZ ==false){
    rotateZ = true;
  }else{
    rotateZ = false;
  }
}
//POINTS : 
var prism_vertex=[
    //points(XYZ)   //color(RGB) 
      -1, 1, -1, 		1,0,0,		//Roof back face	
      0, 1.5, -1,		1,0,0,		// RED
      0, 1, -1,		1,0,0,
      1, 1, -1,		1,0,0,		
      0, 1, -1,		1,0,0,
      0, 1.5, -1,		1,0,0,
      
      -1, 1, 1, 		0,1,0,		//Roof front face	
      0, 1.5, 1,		0,1,0,		// GREEN
      0, 1, 1,		0,1,0,
      1, 1, 1,		0,1,0,		
      0, 1, 1,		0,1,0,
      0, 1.5, 1,		0,1,0,
      
      -1, 1, -1,		0,1,1,		//Roof left side
      -1, 1, 1,		0,1,1,		// BLUE
      0, 1.5,-1,		0,1,1,
      -1, 1, 1,		0,1,1,
      0, 1.5, 1,		0,1,1,
      0, 1.5, -1,		0,1,1,
      
      1, 1, -1,		1,0,1,		//Roof right side
      0, 1.5, -1,		1,0,1,		// PURPLE
      1, 1, 1,		1,0,1,
      1, 1, 1,		1,0,1,
      0, 1.5, -1,		1,0,1,
      0, 1.5, 1,		1,0,1,
      
      //cube
      -1,-1,-1,     	1,1,0,		//Back face
      1,-1,-1,     	1,1,0,		// YELLOW
      1, 1,-1,     	1,1,0,
      -1, 1,-1,     	1,1,0,

      -1,-1, 1,     	0,0,1,		//Front face
      1,-1, 1,     	0,0,1,		// BLUE
      1, 1, 1,     	0,0,1,
      -1, 1, 1,     	0,0,1,

      -1,-1,-1,     	1,0,1,		//Left face
      -1, 1,-1,     	1,0,1,		// PURPLE
      -1, 1, 1,     	1,0,1,
      -1,-1, 1,     	1,0,1,

      1,-1,-1,     	0,0,0,		//Right face	
      1, 1,-1,     	0,0,0,		// WHITE 
      1, 1, 1,     	0,0,0,
      1,-1, 1,     	0,0,0,

      -1,-1,-1,     	1,0,1,		//Bottom face 
      -1,-1, 1,     	1,0,1,		// PURPLE 
      1,-1, 1,     	1,0,1,
      1,-1,-1,     	1,0,1
  ];			  

  //PRISM FACES:
	var prism_faces = [
        //roof
            0,1,2,
            3,4,5,
            
            6,7,8,
            9,10,11,
            
            12,13,14,
            15,16,17,
            
            18,19,20,
            21,22,23,
            
            //cube
            24,25,26,
            24,26,27,
    
            28,29,30,
            28,30,31,
    
            32,33,34,
            32,34,35,
    
            36,37,38,
            36,38,39,
    
            40,41,42,
            40,42,43
        ];

var LIBS={
    degToRad: function(angle){
      return(angle*Math.PI/180);
    },
  
    get_projection: function(angle, a, zMin, zMax) {
      var tan=Math.tan(LIBS.degToRad(0.5*angle)),
          A=-(zMax+zMin)/(zMax-zMin),
            B=(-2*zMax*zMin)/(zMax-zMin);
  
      return [
        0.5/tan, 0 ,   0, 0,
        0, 0.5*a/tan,  0, 0,
        0, 0,         A, -1,
        0, 0,         B, 0
      ];
    },
  
    get_I4: function() {
      return [1,0,0,0,
              0,1,0,0,
              0,0,1,0,
              0,0,0,1];
    },
    get_I3: function() {
      return [1,0,0,0,
              0,1,0,0,
              0,0,1,0,
              0,0,0,1];
    },
    rotateX: function(m, angle) {
      var c=Math.cos(angle);
      var s=Math.sin(angle);
      var mv1=m[1], mv5=m[5], mv9=m[9];
      m[1]=m[1]*c-m[2]*s;
      m[5]=m[5]*c-m[6]*s;
      m[9]=m[9]*c-m[10]*s;
  
      m[2]=m[2]*c+mv1*s;
      m[6]=m[6]*c+mv5*s;
      m[10]=m[10]*c+mv9*s;
    },
  
    rotateY: function(m, angle) {
      var c=Math.cos(angle);
      var s=Math.sin(angle);
      var mv0=m[0], mv4=m[4], mv8=m[8];
      m[0]=c*m[0]+s*m[2];
      m[4]=c*m[4]+s*m[6];
      m[8]=c*m[8]+s*m[10];
  
      m[2]=c*m[2]-s*mv0;
      m[6]=c*m[6]-s*mv4;
      m[10]=c*m[10]-s*mv8;
    },
  
    rotateZ: function(m, angle) {
      var c=Math.cos(angle);
      var s=Math.sin(angle);
      var mv0=m[0], mv4=m[4], mv8=m[8];
      m[0]=c*m[0]-s*m[1];
      m[4]=c*m[4]-s*m[5];
      m[8]=c*m[8]-s*m[9];
  
      m[1]=c*m[1]+s*mv0;
      m[5]=c*m[5]+s*mv4;
      m[9]=c*m[9]+s*mv8;
    },
  
    translateZ: function(m, t){
      m[14]+=t;
    }
  };

  /**
   * main method to display
   */
var main=function() {
	canvas=document.getElementById("glCanvas");
	canvas.width=512;
	canvas.height=512;
	var GL = canvas.getContext("experimental-webgl", {antialias: true});

/*============================ SHADERS =========================*/
	var shader_vertex_source = "\n\
	  attribute vec3 position; 	//the position of the point \n\
	  uniform mat4 Pmatrix; 	//position matrix \n\
	  uniform mat4 Vmatrix; 	//view ref matrix \n\
	  uniform mat4 Mmatrix; 	//movement matrix \n\
	  attribute vec3 color; 	//the color of the point \n\
	  \n\
	  varying vec3 vColor; \n\
    void main(void) { //pre-built function\n\
      gl_Position = vec4(position, 1.0); \n\
	  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.0); //Move w/ Mmatrix b4 projecting \n\
      vColor=color; \n\
	}";
	
	var shader_fragment_source = "\n\
	  precision mediump float;\n\
      \n\
      \n\
      \n\
	  varying vec3 vColor; \n\
    void main(void) {\n\
      gl_FragColor = vec4(vColor, 1.0); \n\
	}";
	
	var get_shader = function(source, type, typeString) {
		var shader = GL.createShader(type);
		GL.shaderSource(shader, source);
		GL.compileShader(shader);
		if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
			alert("ERROR IN "+typeString+" SHADER : "+ GL.getShaderInfoLog(shader));
			return false;
		}
		return shader;
	};
	
	var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");	
	var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

	var SHADER_PROGRAM = GL.createProgram();
	GL.attachShader(SHADER_PROGRAM, shader_vertex);
	GL.attachShader(SHADER_PROGRAM, shader_fragment);
	
	GL.linkProgram(SHADER_PROGRAM);
	var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
	var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
	var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
	
	var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
	var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
	
	GL.enableVertexAttribArray(_color);
	GL.enableVertexAttribArray(_position);
	
	GL.useProgram(SHADER_PROGRAM);
	
	var PRISM_VERTEX=GL.createBuffer();
	GL.bindBuffer(GL.ARRAY_BUFFER, PRISM_VERTEX);
	GL.bufferData(GL.ARRAY_BUFFER, 
				  new Float32Array(prism_vertex),
				  GL.STATIC_DRAW);

	var PRISM_FACES = GL.createBuffer();
	GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PRISM_FACES);
	GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
				  new Uint16Array(prism_faces),	
				  GL.STATIC_DRAW);			  		  
	var PROJMATRIX = LIBS.get_projection(40, canvas.width/canvas.height, 1, 100);
	var MOVEMATRIX = LIBS.get_I4();
	var VIEWMATRIX = LIBS.get_I3();
	
	LIBS.translateZ(VIEWMATRIX, -5); //translate view to see triangle
	
	GL.clearColor(1.0, 1.0, 1.0, 1.0); //Set clearColor to TRANSPARENT
	
	//enable depth buffer test and set depth buffer comparison function
	//set clear value to 1
	GL.enable(GL.DEPTH_TEST);
	GL.depthFunc(GL.LEQUAL);
	GL.clearDepth(1.0);
	var time_old=0;
	var animate = function(time) { //give timestamp as argument
    var dAngle = 0.001*(time - time_old);
    time_old = time;
    if(rotateX){
      LIBS.rotateX(MOVEMATRIX, dAngle);
    }
    if(rotateY){
      LIBS.rotateY(MOVEMATRIX, dAngle);
    }
    if(rotateZ){
      LIBS.rotateZ(MOVEMATRIX, dAngle);    
    }
    //draw the scene
		//set drawing area onto canvas and clear both color and depth
		GL.viewport(0.0, 0.0, canvas.width, canvas.height);
		GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT); 
		GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
		GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
		GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
		//drawing goes here
		GL.bindBuffer(GL.ARRAY_BUFFER, PRISM_VERTEX);
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PRISM_FACES);
		GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4*(3+3), 0);
		GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(3+3), 3*4);
		GL.drawElements(GL.TRIANGLES, 9*2*3, GL.UNSIGNED_SHORT, 0);
		
		GL.flush(); //finished drawing- show render
		
		window.requestAnimationFrame(animate); //Redraw scene as soon as ready
	}; //end animate()	
	
	animate(0);
};